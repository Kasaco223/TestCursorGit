'use client';

import { useState } from 'react';
import { QuoteItem, Quote } from '@/lib/types';
import { FiShoppingCart } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerator from '@/components/PDFGenerator';

interface QuoteSummaryProps {
  items: QuoteItem[];
  onRemoveItem: (index: number) => void;
}

export default function QuoteSummary({ items, onRemoveItem }: QuoteSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const generateQuoteData = (): Quote => {
    const date = new Date().toLocaleDateString('es-ES');
    const quoteNumber = `Q-${Date.now().toString().slice(-6)}`;

    return {
      items,
      total,
      fecha: date,
      numero: quoteNumber,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
    };
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg text-gray-500">
          <FiShoppingCart className="w-12 h-12 mb-4" />
          <p className="text-lg">Tu cotización está vacía</p>
          <p className="text-sm">Agrega productos para comenzar</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.product.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.product.precio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.subtotal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <p className="text-lg font-semibold mb-2">
              Total: ${total}
            </p>
            <div className="border-t border-gray-200 pt-4 mt-4 text-left">
              <h3 className="text-lg font-semibold mb-4">Datos del Cliente</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-900">Nombre</label>
                  <input
                    type="text"
                    id="clientName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-900">Email</label>
                  <input
                    type="email"
                    id="clientEmail"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-900">Teléfono</label>
                  <input
                    type="tel"
                    id="clientPhone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-900">Dirección</label>
                  <input
                    type="text"
                    id="clientAddress"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {items.length > 0 && ( // Solo muestra el botón si hay productos en la cotización
              <PDFDownloadLink
                document={<PDFGenerator quoteData={generateQuoteData()} />}
                fileName={`cotizacion-${generateQuoteData().numero}.pdf`}
              >
                {({ loading }) => (
                  <button
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Generando PDF...' : 'Descargar PDF de Cotización'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </>
      )}
    </div>
  );
}