import React, { useRef } from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { SELLERS } from '../data/mockData';

// Generates an authentic SVG QR Code pattern for the invoice
function InvoiceQRCode({ text = 'BAZAARHUB-GST-INVOICE', size = 88 }) {
  // Deterministic pattern generator based on order/invoice string
  const hash = text.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7);
  const matrixSize = 25;
  const cells = [];

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Finder patterns (top-left, top-right, bottom-left 7x7 squares)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= matrixSize - 7;
      const isBottomLeft = r >= matrixSize - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const ro = isBottomLeft ? r - (matrixSize - 7) : r;
        const co = isTopRight ? c - (matrixSize - 7) : c;
        if (ro === 0 || ro === 6 || co === 0 || co === 6 || (ro >= 2 && ro <= 4 && co >= 2 && co <= 4)) {
          cells.push({ r, c });
        }
      } else {
        // Pseudo-random pseudo-QR data distribution
        const val = ((hash * (r + 1) * 13 + (c + 1) * 37 + (r * c)) % 100);
        if (val > 44) {
          cells.push({ r, c });
        }
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 bg-white p-1 border border-slate-300">
      {cells.map(({ r, c }, idx) => (
        <rect
          key={idx}
          x={c * cellSize}
          y={r * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#111827"
        />
      ))}
    </svg>
  );
}

// Cursive digital signature SVG
function DigitalSignature({ name = 'Authorized Signatory' }) {
  return (
    <div className="w-28 h-12 relative flex items-center justify-center">
      <svg viewBox="0 0 120 45" className="w-full h-full text-blue-900 stroke-current fill-none">
        <path
          d="M 10 32 Q 22 8, 32 20 T 48 24 Q 58 10, 68 28 T 88 18 Q 100 12, 112 25"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 28 35 Q 50 30, 95 34"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function TaxInvoiceModal({ isOpen, onClose, order }) {
  const printRef = useRef(null);

  if (!isOpen || !order) return null;

  // Format order date & invoice date
  const orderDateStr = order.date || '08-05-2026, 06:51 PM';
  const invoiceDateStr = order.date ? `${order.date}, 08:00 PM` : '09-05-2026, 08:00 PM';
  
  // Clean order ID & invoice number
  const cleanOrderId = order.id?.startsWith('ORD-') ? order.id : `OD${order.id || '124887136301360000'}`;
  const invoiceNo = `FAH5VH2${(order.id || '').replace(/\D/g, '').slice(-7).padStart(7, '3000019')}`;

  // Seller details lookup
  const firstItem = order.items?.[0];
  const sellerId = firstItem?.product?.sellerId || 's-1';
  const sellerObj = SELLERS.find(s => s.id === sellerId) || SELLERS[0];
  const sellerName = firstItem?.product?.sellerName || sellerObj?.name || 'GULFISHA NOOR';

  // State-specific GSTIN & PAN
  const sellerGstin = sellerObj?.gstin || '19AQBPN3382R1Z3';
  const sellerPan = sellerGstin.substring(2, 12);
  const sellerAddress = sellerObj?.address || '86A MANSATALA LANE, GRAND FANCY Shop No. 18, KOLKATA - 700023';
  const sellerRegisteredAddress = sellerObj?.registeredAddress || `${sellerName}, SUNYETSEN STREET, KOLKATA - 700012.`;

  // Customer shipping & billing address
  const addr = order.address || {};
  const customerName = addr.name || 'Aishik Mukherjee';
  const line1 = addr.flat || addr.street || 'Vill+Post-Nadiha';
  const line2 = addr.area || addr.landmark || 'Near City Center';
  const cityStatePin = `${addr.city || 'Durgapur'} - ${addr.pincode || '713218'}, IN-${(addr.state || 'WB').slice(0, 2).toUpperCase()}`;

  // Process items & tax calculations (18% GST = 9% CGST + 9% SGST)
  const items = order.items || [];
  const couponDiscountTotal = order.coupon?.discount || 0;
  const itemsSubtotal = items.reduce((acc, i) => acc + (i.product?.price || 0) * (i.quantity || 1), 0);

  let calculatedRows = items.map((item, index) => {
    const qty = item.quantity || 1;
    const price = item.product?.price || 0;
    const grossAmount = price * qty;

    // Distribute coupon discount proportionally
    const itemDiscount = itemsSubtotal > 0 ? (grossAmount / itemsSubtotal) * couponDiscountTotal : 0;
    const netAmount = Math.max(0, grossAmount - itemDiscount);

    // GST Breakdown: Net Amount = Taxable * 1.18
    const taxableValue = Number((netAmount / 1.18).toFixed(2));
    const totalTax = Number((netAmount - taxableValue).toFixed(2));
    const cgst = Number((totalTax / 2).toFixed(2));
    const sgst = Number((totalTax - cgst).toFixed(2));

    // Dynamic HSN code based on category
    const cat = item.product?.category || '';
    let hsnCode = '8517'; // Telecom / Phones / Audio default
    if (cat.includes('watch')) hsnCode = '9102';
    else if (cat.includes('fashion') || cat.includes('apparel')) hsnCode = '6109';
    else if (cat.includes('laptop') || cat.includes('computer')) hsnCode = '8471';
    else if (cat.includes('camera')) hsnCode = '9006';
    else if (cat.includes('home') || cat.includes('appliance')) hsnCode = '8509';

    // IMEI / Serial Number
    const imei = `[[${358124090000000 + (item.product?.id?.charCodeAt(0) || 12) * 100000 + index * 12345}]]`;
    const spec = item.product?.specs?.Storage ? `${item.product.specs.Storage} | ${item.product.specs.RAM || '4 GB'} | ` : '';

    return {
      productTitle: item.product?.name || 'Electronics Product',
      specLine: `${spec}IMEI/SrNo: ${imei}`,
      hsnCode,
      qty,
      grossAmount: grossAmount.toFixed(2),
      discount: itemDiscount > 0 ? `-${itemDiscount.toFixed(2)}` : '-0.00',
      taxableValue: taxableValue.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      total: netAmount.toFixed(2)
    };
  });

  const totalQty = calculatedRows.reduce((acc, r) => acc + r.qty, 0);
  const finalTotal = order.total || items.reduce((acc, i) => acc + (i.product?.price || 0) * (i.quantity || 1), 0);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Download HTML file handler
  const handleDownloadHtml = () => {
    if (!printRef.current) return;
    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${cleanOrderId}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 20px; font-size: 11px; color: #111827; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #cbd5e1; padding: 6px; }
    th { background: #f1f5f9; text-align: left; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
  </style>
</head>
<body>
  ${printRef.current.innerHTML}
</body>
</html>`;
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${cleanOrderId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-w-none print:w-full print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Action Toolbar (Hidden during Print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm">Official GST Tax Invoice</h3>
              <p className="text-[11px] text-slate-400">Order ID: {cleanOrderId} • Invoice: {invoiceNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download HTML file"
            >
              <Download className="w-4 h-4" />
              <span>HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center print:bg-white print:p-0 print:overflow-visible">
          
          <div 
            ref={printRef}
            className="print-invoice-sheet w-full max-w-[800px] bg-white p-6 sm:p-8 border border-slate-300 shadow-sm text-slate-900 font-sans text-[11px] leading-tight space-y-4 print:border-none print:shadow-none print:p-0 print:w-full print:max-w-none"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            
            {/* Header: Tax Invoice + Order / Invoice details + QR Code */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-300">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">Tax Invoice</h1>
              </div>

              <div className="text-[10px] space-y-0.5 text-slate-700 flex-1 px-4">
                <div className="flex justify-between">
                  <span><strong>Order Id:</strong> {cleanOrderId}</span>
                  <span><strong>Invoice No:</strong> {invoiceNo}</span>
                  <span><strong>GSTIN:</strong> {sellerGstin}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span><strong>Order Date:</strong> {orderDateStr}</span>
                  <span><strong>Invoice Date:</strong> {invoiceDateStr}</span>
                  <span><strong>PAN:</strong> {sellerPan}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="shrink-0 text-center">
                <InvoiceQRCode text={`BAZAARHUB|${cleanOrderId}|${invoiceNo}|${sellerGstin}|${finalTotal}`} size={78} />
              </div>
            </div>

            {/* Address Row: Sold By | Shipping Address | Billing Address */}
            <div className="grid grid-cols-3 gap-3 text-[10px] pb-3 border-b border-slate-300">
              
              {/* Sold By */}
              <div className="space-y-0.5 pr-2 border-r border-slate-200">
                <span className="font-bold text-slate-900 block uppercase">Sold By</span>
                <p className="font-bold text-slate-950 uppercase">{sellerName},</p>
                <p className="text-slate-600 uppercase leading-snug">{sellerAddress}</p>
              </div>

              {/* Shipping Address */}
              <div className="space-y-0.5 px-2 border-r border-slate-200">
                <span className="font-bold text-slate-900 block uppercase">Shipping Address</span>
                <p className="font-bold text-slate-950 uppercase">{customerName},</p>
                <p className="text-slate-600 uppercase leading-snug">{line1},</p>
                <p className="text-slate-600 uppercase leading-snug">{line2},</p>
                <p className="text-slate-600 uppercase font-semibold">{cityStatePin}</p>
              </div>

              {/* Billing Address */}
              <div className="space-y-0.5 pl-2">
                <span className="font-bold text-slate-900 block uppercase">Billing Address</span>
                <p className="font-bold text-slate-950 uppercase">{customerName},</p>
                <p className="text-slate-600 uppercase leading-snug">{line1},</p>
                <p className="text-slate-600 uppercase leading-snug">{line2},</p>
                <p className="text-slate-600 uppercase font-semibold">{cityStatePin}</p>
              </div>
            </div>

            {/* Invoice Items & Tax Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                    <th className="py-2 px-2 border-r border-slate-300 w-[30%]">Product</th>
                    <th className="py-2 px-2 border-r border-slate-300 w-[20%]">Description</th>
                    <th className="py-2 px-1 border-r border-slate-300 text-center w-[5%]">Qty</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-right w-[9%]">Gross Amount</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-right w-[8%]">Discount</th>
                    <th className="py-2 px-2 border-r border-slate-300 text-right w-[9%]">Taxable Value</th>
                    <th className="py-2 px-1 border-r border-slate-300 text-right w-[6%]">CGST</th>
                    <th className="py-2 px-1 border-r border-slate-300 text-right w-[7%]">SGST/ UTGST</th>
                    <th className="py-2 px-2 text-right w-[9%]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {calculatedRows.map((row, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-2.5 px-2 border-r border-slate-200">
                        <p className="font-bold text-slate-900 leading-tight">{row.productTitle}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5 font-mono leading-tight">{row.specLine}</p>
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-[9px] text-slate-700">
                        HSN: {row.hsnCode} | CGST: 9% | SGST: 9%
                      </td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-center font-bold">
                        {row.qty}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 text-right font-mono">
                        {row.grossAmount}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 text-right font-mono text-slate-600">
                        {row.discount}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 text-right font-mono">
                        {row.taxableValue}
                      </td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-right font-mono">
                        {row.cgst}
                      </td>
                      <td className="py-2.5 px-1 border-r border-slate-200 text-right font-mono">
                        {row.sgst}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-950">
                        {row.total}
                      </td>
                    </tr>
                  ))}

                  {/* Shipping Row */}
                  <tr className="align-top text-slate-600">
                    <td className="py-1.5 px-2 border-r border-slate-200 font-bold">
                      Shipping Charge
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-200 font-mono text-[9px]">
                      HSN: 9968 | CGST: 0% | SGST: 0%
                    </td>
                    <td className="py-1.5 px-1 border-r border-slate-200 text-center">1</td>
                    <td className="py-1.5 px-2 border-r border-slate-200 text-right font-mono">0.00</td>
                    <td className="py-1.5 px-2 border-r border-slate-200 text-right font-mono">0</td>
                    <td className="py-1.5 px-2 border-r border-slate-200 text-right font-mono">0.00</td>
                    <td className="py-1.5 px-1 border-r border-slate-200 text-right font-mono">0.00</td>
                    <td className="py-1.5 px-1 border-r border-slate-200 text-right font-mono">0.00</td>
                    <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">0.00</td>
                  </tr>

                  {/* Totals Summary Row */}
                  <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                    <td colSpan={2} className="py-2 px-2 border-r border-slate-300 uppercase tracking-wider">
                      TOTAL QTY: {totalQty}
                    </td>
                    <td colSpan={7} className="py-2 px-2 text-right">
                      <span className="uppercase text-[11px] font-black">TOTAL PRICE: {Number(finalTotal).toFixed(2)}</span>
                      <span className="block text-[9px] text-slate-500 font-normal">All values are in INR</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legal Disclaimers & Seller Registration */}
            <div className="space-y-1 text-[9px] text-slate-600 pt-1">
              <p>
                <strong>Seller Registered Address:</strong> {sellerRegisteredAddress}
              </p>
              <p>
                <strong>Declaration:</strong> The goods sold are intended for end user consumption and not for resale.
              </p>
            </div>

            {/* Footer Row: E. & O.E. | Ordered Through | Signature */}
            <div className="pt-4 border-t border-slate-200 flex items-end justify-between">
              
              {/* E. & O.E. + Marketplace Branding */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold">E. & O.E.</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-slate-900">BazaarHub</span>
                  <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1 py-0.2 rounded">Plus</span>
                </div>
              </div>

              {/* Ordered Through Center Tag */}
              <div className="text-center pb-1">
                <span className="text-[10px] font-semibold text-slate-500">Ordered Through</span>
              </div>

              {/* Authorized Signature Box */}
              <div className="text-center flex flex-col items-center">
                <div className="border border-slate-200 bg-slate-50/50 p-1 rounded mb-1">
                  <DigitalSignature name={sellerName} />
                </div>
                <span className="font-bold text-[10px] uppercase text-slate-900 block">{sellerName}</span>
                <span className="text-[9px] text-slate-500 block">Authorized Signature</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
