'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, QuoteItem } from '@/lib/types';
import Papa from 'papaparse';

export default function ProductSelector({ onAddItem }: { onAddItem: (item: QuoteItem) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetch('/data/products.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setProducts(results.data as Product[]);
            const initialQuantities: { [key: string]: number } = {};
            results.data.forEach((product: any) => {
              initialQuantities[product.id] = 1;
            });
            setQuantities(initialQuantities);
          }
        });
      });
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return ['Todos', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const handleQuantityChange = (productId: string, amount: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + amount)
    }));
  };

  const handleAddToQuote = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    onAddItem({
      product,
      cantidad: quantity,
      subtotal: product.precio * quantity
    });
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{product.nombre}</h3>
            <p className="text-sm text-gray-800">{product.category}</p>
            <p className="text-sm text-gray-700 mb-2">{product.descripcion}</p>
            <p className="text-md font-bold text-gray-900 mb-4">${product.precio} / {product.unidad}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="px-3 py-1 bg-gray-100 rounded-l-md hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">
                  {quantities[product.id] || 1}
                </span>
                <button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="px-3 py-1 bg-gray-100 rounded-r-md hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleAddToQuote(product)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Agregar a cotización
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 