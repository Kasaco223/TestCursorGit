'use client';

import { useState } from 'react';
import { QuoteItem } from '@/lib/types';
import ProductSelector from '@/components/ProductSelector';
import QuoteSummary from '@/components/QuoteSummary';

export default function Home() {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  const handleAddItem = (item: QuoteItem) => {
    setQuoteItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        (qItem) => qItem.product.id === item.product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.cantidad + item.cantidad;
        updatedItems[existingItemIndex] = {
          ...existingItem,
          cantidad: newQuantity,
          subtotal: existingItem.product.precio * newQuantity,
        };
        return updatedItems;
      } else {
        return [...prevItems, item];
      }
    });
  };

  const handleRemoveItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Democotizador</h1>
          <button 
            onClick={() => window.location.reload()} // Simple reload para Recargar CSV
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Recargar CSV
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Productos ({/* Total de productos filtrados */})</h2>
            <ProductSelector onAddItem={handleAddItem} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg lg:sticky lg:top-24 lg:h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tu Cotización</h2>
            <QuoteSummary items={quoteItems} onRemoveItem={handleRemoveItem} />
          </div>
        </div>
      </main>
    </div>
  );
}
