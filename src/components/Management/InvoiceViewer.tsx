import React, { useEffect, useState } from 'react';
import { X, Download, Printer, Mail } from 'lucide-react';
import { db } from '../../lib/db';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
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
  subtotal: number;
  sst_rate: number;
  sst_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  payment_terms: string;
}

interface CompanySettings {
  company_name: string;
  company_registration_number: string;
  sst_registration_number?: string;
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

interface InvoiceViewerProps {
  invoiceId: string;
  onClose: () => void;
}

export default function InvoiceViewer({ invoiceId, onClose }: InvoiceViewerProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

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

      const { data: companyData, error: companyError } = await db
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (companyError) {
        console.error('Error loading company settings:', companyError);
      }

      if (!companyData) {
        const defaultCompany: CompanySettings = {
          company_name: 'RapidaCOM Platform',
          company_registration_number: '202201234567',
          sst_registration_number: 'W10-1808-32000123',
          address_line1: 'Level 10, Menara RapidaCOM',
          address_line2: 'Jalan Sultan Ismail',
          city: 'Kuala Lumpur',
          state: 'Wilayah Persekutuan',
          postal_code: '50250',
          country: 'Malaysia',
          phone: '+603-2181-8888',
          email: 'billing@rapidacom.com',
          bank_name: 'Maybank',
          bank_account_number: '514012345678',
          bank_account_name: 'RAPIDACOM SDN BHD'
        };
        setCompany(defaultCompany);
      } else {
        setCompany(companyData);
      }

      setInvoice(invoiceData);
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error loading invoice:', error);
      alert('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
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
      case 'paid': return 'bg-green-100 text-green-800 border-green-300';
      case 'issued': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        <div className="print:hidden flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Invoice Preview</h2>
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
              className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
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

        <div className="p-8 bg-white" id="invoice-content">
          <div className="mb-8 pb-8 border-b-2 border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{company.company_name}</h1>
                <div className="text-slate-600 text-sm space-y-1">
                  <p>{company.address_line1}</p>
                  {company.address_line2 && <p>{company.address_line2}</p>}
                  <p>{company.postal_code} {company.city}, {company.state}</p>
                  <p>{company.country}</p>
                  <p className="mt-2">Tel: {company.phone}</p>
                  <p>Email: {company.email}</p>
                </div>
                <div className="mt-3 text-slate-600 text-sm">
                  <p className="font-semibold">Company Reg. No: {company.company_registration_number}</p>
                  {company.sst_registration_number && (
                    <p className="font-semibold">SST Reg. No: {company.sst_registration_number}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Bill To</h3>
              <div className="text-slate-900">
                <p className="font-semibold text-lg mb-1">{invoice.customer_name}</p>
                {invoice.customer_company && <p className="font-medium">{invoice.customer_company}</p>}
                {invoice.customer_address && (
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{invoice.customer_address}</p>
                )}
                <p className="text-sm text-slate-600 mt-2">{invoice.customer_email}</p>
                {invoice.customer_registration_number && (
                  <p className="text-sm text-slate-600 mt-1">Reg. No: {invoice.customer_registration_number}</p>
                )}
                {invoice.customer_sst_number && (
                  <p className="text-sm text-slate-600">SST No: {invoice.customer_sst_number}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Invoice Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Invoice Number:</span>
                  <span className="font-semibold text-slate-900">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Invoice Date:</span>
                  <span className="text-slate-900">{new Date(invoice.invoice_date).toLocaleDateString('en-MY')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Due Date:</span>
                  <span className="text-slate-900">{new Date(invoice.due_date).toLocaleDateString('en-MY')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-y-2 border-slate-300">
                  <th className="text-left py-3 px-4 text-slate-700 font-semibold">Description</th>
                  <th className="text-right py-3 px-4 text-slate-700 font-semibold">Qty</th>
                  <th className="text-right py-3 px-4 text-slate-700 font-semibold">Unit Price</th>
                  <th className="text-right py-3 px-4 text-slate-700 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-3 px-4 text-slate-900">{item.description}</td>
                    <td className="text-right py-3 px-4 text-slate-900">{item.quantity}</td>
                    <td className="text-right py-3 px-4 text-slate-900">
                      {invoice.currency} {item.unit_price.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-900 font-medium">
                      {invoice.currency} {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>SST ({invoice.sst_rate}%):</span>
                  <span className="font-medium">{invoice.currency} {invoice.sst_amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t-2 border-slate-300">
                <span>Total:</span>
                <span>{invoice.currency} {invoice.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2">Notes:</h4>
              <p className="text-slate-600 text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          <div className="border-t-2 border-slate-200 pt-6">
            <h4 className="font-semibold text-slate-700 mb-2">Payment Terms:</h4>
            <p className="text-slate-600 text-sm mb-4">{invoice.payment_terms}</p>

            {company.bank_name && company.bank_account_number && (
              <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Payment Details:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Bank:</span>
                    <p className="font-medium text-slate-900">{company.bank_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Account Number:</span>
                    <p className="font-medium text-slate-900">{company.bank_account_number}</p>
                  </div>
                  {company.bank_account_name && (
                    <div className="col-span-2">
                      <span className="text-slate-600">Account Name:</span>
                      <p className="font-medium text-slate-900">{company.bank_account_name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-500 text-xs">
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p className="mt-1">For any queries, please contact us at {company.email} or {company.phone}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        }
      `}</style>
    </div>
  );
}
