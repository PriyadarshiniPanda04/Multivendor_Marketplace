/**
 * Live Geolocation and Reverse Geocoding Service
 * Uses HTML5 Geolocation API with OpenStreetMap Nominatim / BigDataCloud fallback
 */

// Fallback coordinate mappings for major Indian hubs if external API is unreachable
function getApproximateCityByCoords(lat, lon) {
  const hubs = [
    { city: 'Bengaluru', state: 'Karnataka', pincode: '560001', lat: 12.9716, lon: 77.5946 },
    { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', lat: 19.0760, lon: 72.8777 },
    { city: 'Delhi', state: 'Delhi', pincode: '110001', lat: 28.6139, lon: 77.2090 },
    { city: 'Hyderabad', state: 'Telangana', pincode: '500001', lat: 17.3850, lon: 78.4867 },
    { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', lat: 13.0827, lon: 80.2707 },
    { city: 'Kolkata', state: 'West Bengal', pincode: '700001', lat: 22.5726, lon: 88.3639 },
    { city: 'Pune', state: 'Maharashtra', pincode: '411001', lat: 18.5204, lon: 73.8567 },
    { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', lat: 23.0225, lon: 72.5714 },
    { city: 'Jaipur', state: 'Rajasthan', pincode: '302001', lat: 26.9124, lon: 75.7873 },
    { city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', lat: 28.5355, lon: 77.3910 }
  ];

  let closest = hubs[0];
  let minDistance = Infinity;

  for (const hub of hubs) {
    const d = Math.hypot(hub.lat - lat, hub.lon - lon);
    if (d < minDistance) {
      minDistance = d;
      closest = hub;
    }
  }
  return closest;
}

/**
 * Request real GPS coordinates from user's device
 */
export function getLiveGPSCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let msg = 'Failed to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again.';
            break;
          default:
            msg = error.message || msg;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}

/**
 * Reverse geocode latitude and longitude to standard address attributes
 */
export async function reverseGeocodeCoordinates(latitude, longitude) {
  try {
    // Primary: BigDataCloud Client Reverse Geocode (free, fast, CORS friendly)
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(bdcUrl);
    
    if (response.ok) {
      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Bengaluru';
      const state = data.principalSubdivision || 'Karnataka';
      const pincode = data.postcode || (lookupPincodeFromState(state) || '560001');
      const area = data.locality || data.localityInfo?.administrative?.[3]?.name || '';

      return {
        city,
        state,
        pincode,
        area,
        country: data.countryName || 'India',
        latitude,
        longitude,
        isLiveLocation: true,
        formattedAddress: [area, city, state, pincode].filter(Boolean).join(', ')
      };
    }
  } catch (err) {
    console.warn('Primary reverse geocoding failed, trying secondary...', err);
  }

  try {
    // Secondary fallback: Nominatim
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    const nomRes = await fetch(nomUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (nomRes.ok) {
      const data = await nomRes.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || 'Bengaluru';
      const state = addr.state || 'Karnataka';
      const pincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '560001';
      const area = addr.suburb || addr.neighbourhood || addr.road || '';

      return {
        city,
        state,
        pincode,
        area,
        country: addr.country || 'India',
        latitude,
        longitude,
        isLiveLocation: true,
        formattedAddress: data.display_name || [area, city, state, pincode].filter(Boolean).join(', ')
      };
    }
  } catch (err) {
    console.warn('Secondary reverse geocoding failed, using coordinate fallback', err);
  }

  // Graceful fallback to nearest hub
  const approx = getApproximateCityByCoords(latitude, longitude);
  return {
    city: approx.city,
    state: approx.state,
    pincode: approx.pincode,
    area: 'Current Area',
    country: 'India',
    latitude,
    longitude,
    isLiveLocation: true,
    formattedAddress: `${approx.city}, ${approx.state} - ${approx.pincode}`
  };
}

function lookupPincodeFromState(state) {
  if (!state) return '560001';
  const s = state.toLowerCase();
  if (s.includes('karnataka')) return '560001';
  if (s.includes('maharashtra')) return '400001';
  if (s.includes('delhi')) return '110001';
  if (s.includes('tamil nadu')) return '600001';
  if (s.includes('telangana')) return '500001';
  if (s.includes('west bengal')) return '700001';
  if (s.includes('gujarat')) return '380001';
  if (s.includes('odisha')) return '751001';
  if (s.includes('rajasthan')) return '302001';
  if (s.includes('uttar pradesh')) return '226001';
  return '560001';
}

// Memory cache for PIN lookups
const pincodeCache = {};

/**
 * Fast client-side prefix heuristic for all 1-9 Indian postal zones
 */
export function getQuickPincodeInfo(pincode) {
  if (!pincode || pincode.length < 2) return null;
  const p2 = pincode.substring(0, 2);
  const p3 = pincode.substring(0, 3);

  // Odisha
  if (p3 === '751') return { city: 'Bhubaneswar', state: 'Odisha' };
  if (p3 === '752') return { city: 'Puri', state: 'Odisha' };
  if (p3 === '753') return { city: 'Cuttack', state: 'Odisha' };
  if (p3 === '754') return { city: 'Jagatsinghpur', state: 'Odisha' };
  if (p3 === '755') return { city: 'Jajpur', state: 'Odisha' };
  if (p3 === '756') return { city: 'Balasore', state: 'Odisha' };
  if (p3 === '757') return { city: 'Baripada', state: 'Odisha' };
  if (p3 === '758') return { city: 'Kendujhar', state: 'Odisha' };
  if (p3 === '759') return { city: 'Dhenkanal', state: 'Odisha' };
  if (p3 === '760') return { city: 'Berhampur', state: 'Odisha' };
  if (p3 === '761') return { city: 'Ganjam', state: 'Odisha' };
  if (p3 === '764') return { city: 'Koraput', state: 'Odisha' };
  if (p3 === '768') return { city: 'Sambalpur', state: 'Odisha' };
  if (p3 === '769') return { city: 'Rourkela', state: 'Odisha' };
  if (p2 === '75' || p2 === '76' || p2 === '77') return { city: 'Odisha', state: 'Odisha' };

  // Karnataka
  if (p2 === '56') return { city: 'Bengaluru', state: 'Karnataka' };
  if (p2 === '57') return { city: 'Mangaluru', state: 'Karnataka' };
  if (p2 === '58') return { city: 'Hubballi-Dharwad', state: 'Karnataka' };
  if (p2 === '59') return { city: 'Belagavi', state: 'Karnataka' };

  // Delhi & NCR
  if (p2 === '11') return { city: 'New Delhi', state: 'Delhi' };
  if (p3 === '201') return { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' };
  if (p3 === '122') return { city: 'Gurugram', state: 'Haryana' };
  if (p3 === '121') return { city: 'Faridabad', state: 'Haryana' };

  // Maharashtra & Goa
  if (p2 === '40') return { city: 'Mumbai', state: 'Maharashtra' };
  if (p2 === '41') return { city: 'Pune', state: 'Maharashtra' };
  if (p2 === '42') return { city: 'Thane / Nashik', state: 'Maharashtra' };
  if (p2 === '43') return { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' };
  if (p2 === '44') return { city: 'Nagpur', state: 'Maharashtra' };
  if (p3 === '403') return { city: 'Goa', state: 'Goa' };

  // Tamil Nadu & Puducherry
  if (p2 === '60') return { city: 'Chennai', state: 'Tamil Nadu' };
  if (p2 === '61') return { city: 'Tiruchirappalli', state: 'Tamil Nadu' };
  if (p2 === '62') return { city: 'Madurai', state: 'Tamil Nadu' };
  if (p2 === '63') return { city: 'Salem', state: 'Tamil Nadu' };
  if (p2 === '64') return { city: 'Coimbatore', state: 'Tamil Nadu' };
  if (p3 === '605') return { city: 'Puducherry', state: 'Puducherry' };

  // Telangana & Andhra Pradesh
  if (p2 === '50') return { city: 'Hyderabad', state: 'Telangana' };
  if (p3 === '530') return { city: 'Visakhapatnam', state: 'Andhra Pradesh' };
  if (p3 === '520') return { city: 'Vijayawada', state: 'Andhra Pradesh' };
  if (p3 === '522') return { city: 'Guntur', state: 'Andhra Pradesh' };
  if (p3 === '517') return { city: 'Tirupati', state: 'Andhra Pradesh' };

  // West Bengal
  if (p2 === '70') return { city: 'Kolkata', state: 'West Bengal' };
  if (p3 === '711') return { city: 'Howrah', state: 'West Bengal' };
  if (p3 === '734') return { city: 'Siliguri', state: 'West Bengal' };

  // Gujarat
  if (p2 === '38') return { city: 'Ahmedabad', state: 'Gujarat' };
  if (p2 === '39') return { city: 'Surat', state: 'Gujarat' };
  if (p2 === '36') return { city: 'Rajkot', state: 'Gujarat' };

  // Rajasthan
  if (p2 === '30') return { city: 'Jaipur', state: 'Rajasthan' };
  if (p2 === '34') return { city: 'Jodhpur', state: 'Rajasthan' };
  if (p2 === '31') return { city: 'Udaipur', state: 'Rajasthan' };
  if (p2 === '32') return { city: 'Kota', state: 'Rajasthan' };

  // Uttar Pradesh & Uttarakhand
  if (p2 === '22') return { city: 'Lucknow', state: 'Uttar Pradesh' };
  if (p2 === '20') return { city: 'Aligarh / Noida', state: 'Uttar Pradesh' };
  if (p2 === '24') return { city: 'Bareilly / Moradabad', state: 'Uttar Pradesh' };
  if (p2 === '28') return { city: 'Agra / Jhansi', state: 'Uttar Pradesh' };
  if (p3 === '248') return { city: 'Dehradun', state: 'Uttarakhand' };

  // Kerala
  if (p2 === '68') return { city: 'Kochi', state: 'Kerala' };
  if (p2 === '69') return { city: 'Thiruvananthapuram', state: 'Kerala' };
  if (p2 === '67') return { city: 'Kozhikode', state: 'Kerala' };

  // Bihar & Jharkhand
  if (p2 === '80') return { city: 'Patna', state: 'Bihar' };
  if (p2 === '83') return { city: 'Ranchi', state: 'Jharkhand' };

  // Madhya Pradesh & Chhattisgarh
  if (p2 === '46') return { city: 'Bhopal', state: 'Madhya Pradesh' };
  if (p2 === '45') return { city: 'Indore', state: 'Madhya Pradesh' };
  if (p2 === '49') return { city: 'Raipur', state: 'Chhattisgarh' };

  // Assam & Northeast
  if (p2 === '78') return { city: 'Guwahati', state: 'Assam' };
  if (p2 === '79') return { city: 'Northeast Region', state: 'Assam' };

  // Punjab, Chandigarh & Haryana
  if (p2 === '14') return { city: 'Ludhiana / Jalandhar', state: 'Punjab' };
  if (p2 === '16') return { city: 'Chandigarh', state: 'Chandigarh' };

  return null;
}

/**
 * Resolves any Indian 6-digit postal PIN code to City, District, and State
 * Uses api.postalpincode.in with instant client heuristic fallback
 */
export async function resolvePincodeToLocation(rawPincode) {
  if (!rawPincode) return { city: 'India', state: '', pincode: '' };
  const pin = String(rawPincode).replace(/\D/g, '').slice(0, 6);

  if (pincodeCache[pin]) {
    return pincodeCache[pin];
  }

  // Pre-calculate instant fallback
  const quick = getQuickPincodeInfo(pin) || {
    city: `PIN ${pin}`,
    state: 'India'
  };

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const city = po.Division || po.District || po.Block || po.Name || quick.city;
        const state = po.State || quick.state;
        const area = po.Name || po.Block || '';

        const resolved = {
          city,
          state,
          area,
          district: po.District || city,
          pincode: pin,
          country: 'India',
          formatted: `${city}, ${state} - ${pin}`
        };

        pincodeCache[pin] = resolved;
        return resolved;
      }
    }
  } catch (e) {
    console.warn('postalpincode.in API failed, using instant heuristic', e);
  }

  const fallback = {
    city: quick.city,
    state: quick.state,
    area: '',
    pincode: pin,
    country: 'India',
    formatted: `${quick.city}, ${quick.state} - ${pin}`
  };

  pincodeCache[pin] = fallback;
  return fallback;
}

