'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuoteItem } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555555',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 8,
  },
  totalSection: {
    marginTop: 20,
    textAlign: 'right',
  },
});

interface PDFGeneratorProps {
  quoteData: {
    items: QuoteItem[];
    total: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    fecha: string;
    numero: string;
  };
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ quoteData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Cotización de Productos</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Datos del Cliente:</Text>
        <Text style={styles.text}>Nombre: {quoteData.clientName}</Text>
        <Text style={styles.text}>Email: {quoteData.clientEmail}</Text>
        <Text style={styles.text}>Teléfono: {quoteData.clientPhone}</Text>
        <Text style={styles.text}>Dirección: {quoteData.clientAddress}</Text>
        <Text style={styles.text}>Fecha: {quoteData.fecha}</Text>
        <Text style={styles.text}>Número de Cotización: {quoteData.numero}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Detalle de Productos:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Producto</Text>
            <Text style={styles.tableColHeader}>Cantidad</Text>
            <Text style={styles.tableColHeader}>Precio Unit.</Text>
            <Text style={styles.tableColHeader}>Subtotal</Text>
          </View>
          {quoteData.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{item.product.nombre}</Text>
              <Text style={styles.tableCol}>{item.cantidad}</Text>
              <Text style={styles.tableCol}>${item.product.precio}</Text>
              <Text style={styles.tableCol}>${item.subtotal}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.subHeader}>Total: ${quoteData.total}</Text>
      </View>
    </Page>
  </Document>
);

export default PDFGenerator; 