export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  unidad: string;
  category: string;
}

export interface QuoteItem {
  product: Product;
  cantidad: number;
  subtotal: number;
}

export interface Quote {
  items: QuoteItem[];
  total: number;
  fecha: string;
  numero: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
} 