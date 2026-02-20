import React, { useEffect, useState } from 'react';
import { X, Download, Printer, Mail, CheckCircle2, QrCode, FileText, Table } from 'lucide-react';
import { db } from '../../lib/db';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  classification_code?: string;
  tax_type?: string;
  tax_rate?: number;
  tax_amount?: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_company?: string;
  customer_registration_number?: string;
  customer_sst_number?: string;
  customer_tin?: string;
  subtotal: number;
  sst_rate: number;
  sst_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  payment_terms: string;
  myinvois_uuid?: string;
  myinvois_submission_date?: string;
  myinvois_validation_link?: string;
}

interface CompanySettings {
  company_name: string;
  company_registration_number: string;
  sst_registration_number?: string;
  tin?: string;
  msic_code?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
}

interface MalaysianInvoiceViewerProps {
  invoiceId: string;
  onClose: () => void;
}

export default function MalaysianInvoiceViewer({ invoiceId, onClose }: MalaysianInvoiceViewerProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState<string>('');

  useEffect(() => {
    loadInvoiceData();
  }, [invoiceId]);

  const loadInvoiceData = async () => {
    try {
      const { data: invoiceData, error: invoiceError } = await db
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      const { data: itemsData, error: itemsError } = await db
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId);

      if (itemsError) throw itemsError;

      const { data: companyData } = await db
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      const defaultCompany: CompanySettings = {
        company_name: 'RAPIDACOM SDN BHD',
        company_registration_number: '202201234567 (1234567-A)',
        sst_registration_number: 'W10-1808-32000123',
        tin: '202201234567',
        msic_code: '61100',
        address_line1: 'Level 10, Menara RapidaCOM',
        address_line2: 'Jalan Sultan Ismail',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        postal_code: '50250',
        country: 'Malaysia',
        phone: '+603-2181-8888',
        email: 'billing@rapidacom.com',
        bank_name: 'Malayan Banking Berhad (Maybank)',
        bank_account_number: '514012345678',
        bank_account_name: 'RAPIDACOM SDN BHD'
      };

      const myinvoisUuid = invoiceData.myinvois_uuid || generateMyInvoisUUID(invoiceData.invoice_number);
      const myinvoisValidationLink = invoiceData.myinvois_validation_link ||
        `https://myinvois.hasil.gov.my/verify/${myinvoisUuid}`;

      const enhancedInvoice = {
        ...invoiceData,
        myinvois_uuid: myinvoisUuid,
        myinvois_submission_date: invoiceData.myinvois_submission_date || invoiceData.invoice_date,
        myinvois_validation_link: myinvoisValidationLink
      };

      setInvoice(enhancedInvoice);
      setItems(itemsData || []);
      setCompany(companyData || defaultCompany);

      const qrData = generateQRCodeData(enhancedInvoice, companyData || defaultCompany);
      setQrCodeData(qrData);

    } catch (error) {
      console.error('Error loading invoice:', error);
      alert('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const generateMyInvoisUUID = (invoiceNumber: string): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `${invoiceNumber}-${timestamp}-${random}`.toUpperCase();
  };

  const generateQRCodeData = (inv: Invoice, comp: CompanySettings): string => {
    const qrData = [
      comp.company_name,
      comp.company_registration_number,
      inv.myinvois_uuid || '',
      inv.invoice_date,
      inv.total_amount.toFixed(2),
      inv.sst_amount.toFixed(2),
      inv.myinvois_validation_link || ''
    ].join('|');

    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const invoiceContent = document.getElementById('invoice-content');
    if (!invoiceContent) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice?.invoice_number}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 20px;
              color: #1e293b;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            .invoice-header {
              border-bottom: 2px solid #39FF14;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-info h1 {
              font-size: 24px;
              font-weight: bold;
              color: #39FF14;
              margin-bottom: 8px;
            }
            .company-info p {
              font-size: 13px;
              color: #64748b;
              line-height: 1.6;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .invoice-meta h2 {
              font-size: 28px;
              font-weight: bold;
              color: #0f172a;
              margin-bottom: 12px;
            }
            .invoice-meta .meta-item {
              display: flex;
              gap: 12px;
              margin-bottom: 6px;
            }
            .invoice-meta .label {
              font-size: 13px;
              color: #64748b;
              width: 120px;
            }
            .invoice-meta .value {
              font-size: 13px;
              color: #0f172a;
              font-weight: 500;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              background: #dcfce7;
              color: #166534;
            }
            .customer-section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .customer-section h3 {
              font-size: 14px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 12px;
            }
            .customer-section p {
              font-size: 13px;
              color: #475569;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            thead {
              background: #39FF14;
              color: white;
            }
            th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 13px;
            }
            tbody tr:hover {
              background: #f8fafc;
            }
            .text-right {
              text-align: right;
            }
            .summary {
              max-width: 350px;
              margin-left: auto;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 13px;
            }
            .summary-row.total {
              border-top: 2px solid #39FF14;
              padding-top: 12px;
              margin-top: 8px;
              font-size: 16px;
              font-weight: bold;
              color: #39FF14;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              font-size: 12px;
              color: #64748b;
              line-height: 1.6;
            }
            .qr-section {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
            }
            .qr-section p {
              font-size: 11px;
              color: #64748b;
              margin-top: 8px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${invoiceContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadJSON = () => {
    if (!invoice) return;

    const invoiceData = {
      invoice,
      items,
      company,
      generated_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoice.invoice_number}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!invoice || !items.length) return;

    let csvContent = 'Invoice Details\n';
    csvContent += `Invoice Number,${invoice.invoice_number}\n`;
    csvContent += `Invoice Date,${invoice.invoice_date}\n`;
    csvContent += `Due Date,${invoice.due_date}\n`;
    csvContent += `Customer,${invoice.customer_name}\n`;
    csvContent += `Status,${invoice.status}\n\n`;

    csvContent += 'Line Items\n';
    csvContent += 'Description,Quantity,Unit Price,Amount\n';
    items.forEach(item => {
      csvContent += `"${item.description}",${item.quantity},${item.unit_price},${item.amount}\n`;
    });

    csvContent += '\nSummary\n';
    csvContent += `Subtotal,${invoice.subtotal}\n`;
    csvContent += `SST (${invoice.sst_rate}%),${invoice.sst_amount}\n`;
    csvContent += `Total,${invoice.total_amount}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoice.invoice_number}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEmailInvoice = async () => {
    alert('Email functionality will be implemented with email service integration');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!invoice || !company) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <p className="text-slate-900 text-center mb-4">Invoice not found</p>
          <button
            onClick={onClose}
            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'issued': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="print:hidden flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Malaysian E-Invoice</h2>
            <p className="text-sm text-slate-600">MyInvois Compliant</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEmailInvoice}
              className="p-2 text-slate-600 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors"
              title="Email Invoice"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Download as PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadJSON}
              className="p-2 text-slate-600 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors"
              title="Download JSON Data"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadCSV}
              className="p-2 text-slate-600 hover:text-[#32e012] hover:bg-[#39FF14]/10 rounded-lg transition-colors"
              title="Download CSV"
            >
              <Table className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-8 bg-white" id="invoice-content">
          <div className="mb-6 pb-6 border-b-4 border-emerald-600">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{company.company_name}</h1>
                <p className="text-sm text-slate-600 font-semibold mb-3">
                  Co. Reg. No.: {company.company_registration_number}
                </p>
                {company.sst_registration_number && (
                  <p className="text-sm text-slate-600 font-semibold mb-3">
                    SST Reg. No.: {company.sst_registration_number}
                  </p>
                )}
                {company.tin && (
                  <p className="text-sm text-slate-600 font-semibold mb-3">
                    TIN: {company.tin}
                  </p>
                )}
                {company.msic_code && (
                  <p className="text-sm text-slate-600 font-semibold mb-3">
                    MSIC Code: {company.msic_code}
                  </p>
                )}
                <div className="text-slate-600 text-sm space-y-0.5 mt-2">
                  <p>{company.address_line1}</p>
                  {company.address_line2 && <p>{company.address_line2}</p>}
                  <p>{company.postal_code} {company.city}</p>
                  <p>{company.state}, {company.country}</p>
                  <p className="mt-2">Tel: {company.phone}</p>
                  <p>Email: {company.email}</p>
                </div>
              </div>

              <div className="text-right ml-6">
                {qrCodeData && (
                  <div className="mb-3">
                    <img src={qrCodeData} alt="MyInvois QR Code" className="w-32 h-32 mx-auto border-2 border-slate-200 rounded" />
                    <p className="text-xs text-slate-500 mt-1">Scan to verify</p>
                  </div>
                )}
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-2xl font-bold text-emerald-900">TAX INVOICE / E-INVOICE</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600 font-semibold">MyInvois UUID:</span>
                  <p className="font-mono text-xs text-slate-900 break-all">{invoice.myinvois_uuid}</p>
                </div>
                <div>
                  <span className="text-slate-600 font-semibold">Submission Date:</span>
                  <p className="text-slate-900">{new Date(invoice.myinvois_submission_date || invoice.invoice_date).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              {invoice.myinvois_validation_link && (
                <div className="mt-2">
                  <span className="text-slate-600 font-semibold text-sm">Validation:</span>
                  <p className="text-xs text-[#39FF14] break-all">{invoice.myinvois_validation_link}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 bg-slate-100 px-3 py-2 rounded">Bill To</h3>
              <div className="text-slate-900">
                <p className="font-bold text-lg mb-1">{invoice.customer_name}</p>
                {invoice.customer_company && <p className="font-semibold text-slate-700">{invoice.customer_company}</p>}
                {invoice.customer_registration_number && (
                  <p className="text-sm text-slate-600 mt-1">Co. Reg. No.: {invoice.customer_registration_number}</p>
                )}
                {invoice.customer_tin && (
                  <p className="text-sm text-slate-600">TIN: {invoice.customer_tin}</p>
                )}
                {invoice.customer_sst_number && (
                  <p className="text-sm text-slate-600">SST No.: {invoice.customer_sst_number}</p>
                )}
                {invoice.customer_address && (
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{invoice.customer_address}</p>
                )}
                <p className="text-sm text-slate-600 mt-2">{invoice.customer_email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 bg-slate-100 px-3 py-2 rounded">Invoice Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-semibold">Invoice No.:</span>
                  <span className="font-bold text-slate-900">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-semibold">Invoice Date:</span>
                  <span className="text-slate-900">{new Date(invoice.invoice_date).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-semibold">Due Date:</span>
                  <span className="text-slate-900">{new Date(invoice.due_date).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Currency:</span>
                  <span className="text-slate-900 font-bold">{invoice.currency}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left py-3 px-4 font-bold text-sm">Description</th>
                  <th className="text-center py-3 px-4 font-bold text-sm">Qty</th>
                  <th className="text-right py-3 px-4 font-bold text-sm">Unit Price<br/><span className="text-xs">({invoice.currency})</span></th>
                  <th className="text-right py-3 px-4 font-bold text-sm">Amount<br/><span className="text-xs">({invoice.currency})</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <td className="py-3 px-4 text-slate-900">
                      <p className="font-medium">{item.description}</p>
                      {item.classification_code && (
                        <p className="text-xs text-slate-500 mt-1">Classification: {item.classification_code}</p>
                      )}
                    </td>
                    <td className="text-center py-3 px-4 text-slate-900">{item.quantity}</td>
                    <td className="text-right py-3 px-4 text-slate-900">
                      {item.unit_price.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-900 font-semibold">
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-6">
            <div className="w-96">
              <div className="space-y-2 mb-2">
                <div className="flex justify-between text-slate-700 text-sm">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-bold">{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700 text-sm border-t border-slate-300 pt-2">
                  <span className="font-semibold">Sales & Service Tax (SST @ {invoice.sst_rate}%):</span>
                  <span className="font-bold">{invoice.currency} {invoice.sst_amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-white bg-emerald-600 px-4 py-3 rounded-lg mt-3">
                <span>TOTAL AMOUNT:</span>
                <span>{invoice.currency} {invoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="text-center text-xs text-slate-600 mt-2">
                <p className="font-semibold">Amount in Words:</p>
                <p className="italic">{numberToWords(invoice.total_amount)} {invoice.currency} Only</p>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mb-6 p-4 bg-[#39FF14]/10 border-l-4 border-[#39FF14]/50 rounded">
              <h4 className="font-bold text-slate-700 mb-2">Notes:</h4>
              <p className="text-slate-700 text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          <div className="border-t-2 border-slate-300 pt-6 mb-4">
            <h4 className="font-bold text-slate-700 mb-2">Payment Terms & Conditions:</h4>
            <p className="text-slate-600 text-sm mb-4">{invoice.payment_terms}</p>

            {company.bank_name && company.bank_account_number && (
              <div className="bg-[#39FF14]/10 border-2 border-[#39FF14]/30 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#39FF14] rounded-full"></div>
                  Bank Transfer Details:
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600 font-semibold">Bank Name:</span>
                    <p className="font-bold text-slate-900">{company.bank_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-semibold">Account Number:</span>
                    <p className="font-bold text-slate-900">{company.bank_account_number}</p>
                  </div>
                  {company.bank_account_name && (
                    <div className="col-span-2">
                      <span className="text-slate-600 font-semibold">Account Name:</span>
                      <p className="font-bold text-slate-900">{company.bank_account_name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600">
              <p className="font-semibold mb-1">Important Information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>This is a computer-generated e-invoice and does not require a signature</li>
                <li>This invoice has been submitted to MyInvois portal in compliance with Malaysian Digital Economy regulations</li>
                <li>Payment should be made to the bank account specified above</li>
                <li>Please quote the invoice number in your payment reference</li>
                <li>For any queries, please contact us at {company.email} or {company.phone}</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-300 text-center">
            <p className="text-xs text-slate-500 mb-1">This E-Invoice is MyInvois Compliant</p>
            <p className="text-xs text-slate-500">Generated on: {new Date().toLocaleString('en-MY')}</p>
          </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const numStr = num.toFixed(2);
  const [intPart, decPart] = numStr.split('.');
  const intNum = parseInt(intPart);

  let words = '';

  if (intNum >= 1000000) {
    words += ones[Math.floor(intNum / 1000000)] + ' Million ';
    const remainder = intNum % 1000000;
    if (remainder > 0) {
      words += convertThousands(remainder);
    }
  } else {
    words = convertThousands(intNum);
  }

  if (parseInt(decPart) > 0) {
    words += ` and ${decPart}/100`;
  }

  return words.trim();
}

function convertThousands(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  let words = '';

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += convertHundreds(thousands) + ' Thousand ';
    num %= 1000;
  }

  if (num > 0) {
    words += convertHundreds(num);
  }

  return words;
}

function convertHundreds(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  let words = '';

  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }

  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    return words;
  }

  if (num > 0) {
    words += ones[num] + ' ';
  }

  return words;
}
