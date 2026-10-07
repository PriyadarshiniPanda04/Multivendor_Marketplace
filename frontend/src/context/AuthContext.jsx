import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from '../firebase/firebase';
import { getQuickPincodeInfo } from '../services/locationService';

const AuthContext = createContext(null);

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    name: 'Rahul Verma',
    phone: '9876543210',
    flat: 'Flat 402, Lotus Residency',
    area: '12th Main Road, Indiranagar',
    landmark: 'Opposite BDA Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    type: 'Home',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Rahul Verma (Office)',
    phone: '9876543210',
    flat: 'Block 4B, 3rd Floor, Bagmane Tech Park',
    area: 'CV Raman Nagar',
    landmark: 'Near Byrasandra Lake',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560093',
    type: 'Work',
    isDefault: false
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('bazaarhub_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.city && parsed.city !== 'India') {
          return parsed;
        }
        if (parsed.pincode) {
          const quick = getQuickPincodeInfo(parsed.pincode);
          if (quick) {
            return {
              ...parsed,
              city: quick.city,
              state: quick.state
            };
          }
          return { ...parsed, city: `PIN ${parsed.pincode}` };
        }
      }
      return { city: 'Bengaluru', pincode: '560038', country: 'India' };
    } catch {
      return { city: 'Bengaluru', pincode: '560038', country: 'India' };
    }
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Sync with existing stored local preferences if available
        let storedUser = null;
        try {
          const raw = localStorage.getItem('bazaarhub_user');
          if (raw) storedUser = JSON.parse(raw);
        } catch {
          // ignore
        }

        const syncedUser = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || storedUser?.name || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || storedUser?.photoURL || null,
          phone: firebaseUser.phoneNumber || storedUser?.phone || '+91 98765 43210',
          role: storedUser?.role || 'customer',
          sellerId: storedUser?.role === 'seller' ? (storedUser?.sellerId || 's-1') : null,
          addresses: storedUser?.addresses || DEFAULT_ADDRESSES
        };
        setUser(syncedUser);
        localStorage.setItem('bazaarhub_user', JSON.stringify(syncedUser));
      } else {
        // If guest user, retain guest session unless explicitly logged out
        setUser((prev) => {
          if (prev?.isGuest) return prev;
          localStorage.removeItem('bazaarhub_user');
          return null;
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bazaarhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bazaarhub_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bazaarhub_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  // 1. Firebase Email & Password Login
  const login = async (email, password, role = 'customer') => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      const newUser = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || email.split('@')[0].replace(/[._]/g, ' '),
        email: fbUser.email,
        photoURL: fbUser.photoURL || null,
        phone: fbUser.phoneNumber || '+91 98765 12345',
        role,
        sellerId: role === 'seller' ? 's-1' : null,
        addresses: DEFAULT_ADDRESSES
      };

      setUser(newUser);
      localStorage.setItem('bazaarhub_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  // 2. Firebase Google Sign-In Popup
  const loginWithGoogle = async (role = 'customer') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const newUser = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || 'Google User',
        email: fbUser.email,
        photoURL: fbUser.photoURL || null,
        phone: fbUser.phoneNumber || '+91 98765 43210',
        role,
        sellerId: role === 'seller' ? 's-1' : null,
        addresses: DEFAULT_ADDRESSES
      };

      setUser(newUser);
      localStorage.setItem('bazaarhub_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  // 3. Firebase Email & Password Registration
  const register = async ({ name, email, password, phone, role = 'customer' }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // Update profile with display name
      if (name) {
        await updateProfile(fbUser, { displayName: name });
      }

      const newUser = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: name || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email,
        photoURL: null,
        phone: phone || '+91 98765 00000',
        role,
        sellerId: role === 'seller' ? 's-1' : null,
        addresses: []
      };

      setUser(newUser);
      localStorage.setItem('bazaarhub_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  // 4. Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('bazaarhub_user');
  };

  // 5. Password Reset
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) };
    }
  };

  // 6. Guest Mode
  const continueAsGuest = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      name: 'Guest Shopper',
      email: 'guest@bazaarhub.local',
      role: 'customer',
      isGuest: true,
      addresses: []
    };
    setUser(guestUser);
    return guestUser;
  };

  const switchRole = (role) => {
    if (!user) return;
    setUser((prev) => ({
      ...prev,
      role,
      sellerId: role === 'seller' ? (prev.sellerId || 's-1') : prev.sellerId
    }));
  };

  const updateDeliveryLocation = (location) => {
    setDeliveryLocation(location);
  };

  // Address Management
  const addAddress = (newAddr) => {
    const addrWithId = {
      ...newAddr,
      id: newAddr.id || 'addr-' + Date.now(),
      isDefault: newAddr.isDefault || (!user?.addresses || user.addresses.length === 0)
    };

    setUser(prev => {
      if (!prev) return prev;
      const currentAddrs = prev.addresses || DEFAULT_ADDRESSES;
      let updatedAddrs;
      if (addrWithId.isDefault) {
        updatedAddrs = currentAddrs.map(a => ({ ...a, isDefault: false }));
        updatedAddrs = [addrWithId, ...updatedAddrs];
      } else {
        updatedAddrs = [...currentAddrs, addrWithId];
      }
      return { ...prev, addresses: updatedAddrs };
    });

    if (addrWithId.isDefault && addrWithId.city && addrWithId.pincode) {
      setDeliveryLocation({
        city: addrWithId.city,
        pincode: addrWithId.pincode,
        country: 'India'
      });
    }

    return addrWithId;
  };

  const updateAddress = (addrId, updatedData) => {
    setUser(prev => {
      if (!prev) return prev;
      const currentAddrs = prev.addresses || DEFAULT_ADDRESSES;
      const updated = currentAddrs.map(addr => {
        if (addr.id === addrId) {
          return { ...addr, ...updatedData };
        }
        if (updatedData.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
      return { ...prev, addresses: updated };
    });
  };

  const deleteAddress = (addrId) => {
    setUser(prev => {
      if (!prev) return prev;
      const currentAddrs = prev.addresses || DEFAULT_ADDRESSES;
      const filtered = currentAddrs.filter(a => a.id !== addrId);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, addresses: filtered };
    });
  };

  const setDefaultAddress = (addrId) => {
    setUser(prev => {
      if (!prev) return prev;
      const currentAddrs = prev.addresses || DEFAULT_ADDRESSES;
      const updated = currentAddrs.map(a => ({
        ...a,
        isDefault: a.id === addrId
      }));
      const def = updated.find(a => a.isDefault);
      if (def && def.city && def.pincode) {
        setDeliveryLocation({
          city: def.city,
          pincode: def.pincode,
          country: 'India'
        });
      }
      return { ...prev, addresses: updated };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isSeller: user?.role === 'seller' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
        deliveryLocation,
        updateDeliveryLocation,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
        continueAsGuest,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Convert Firebase auth error codes into friendly user messages
function getFirebaseErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/cancelled-popup-request':
      return 'Another sign-in popup was already active.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for sign-in.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console. Please add localhost to Authorized Domains.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

