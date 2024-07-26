import React, { useState, useEffect } from 'react';
import './TotalTable.css';

interface TotalTableProps {
  items: number;
  people: number;
  columns: string[];
  data: { price: number; portions: number[] }[];
}

const TotalTable: React.FC<TotalTableProps> = ({ items, people, columns, data }) => {
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [totals, setTotals] = useState<number[]>(Array(people).fill(0));

  useEffect(() => {
    let subtotalSum = 0;
    let newTotals = Array(people).fill(0);

    data.forEach(row => {
      subtotalSum += row.price;
      row.portions.forEach((portion, index) => {
        const amountPerPortion = row.price / row.portions.reduce((sum, p) => sum + p, 0);
        newTotals[index] += portion * amountPerPortion;
      });
    });

    setSubtotal(subtotalSum);
    setTotals(newTotals);
  }, [items, people, data]);

  return (
    <div className="total-table-container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            {columns.slice(2, columns.length - 1).map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>{subtotal.toFixed(2)}</td>
            {totals.map((total, index) => (
              <td key={index}>{total.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Tax</td>
            <td>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              />
            </td>
            {totals.map((_, index) => (
              <td key={index}></td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td>{(subtotal + tax).toFixed(2)}</td>
            {totals.map((total, index) => (
              <td key={index} style={{ fontWeight: 'bold' }}>{(total + tax).toFixed(2)}</td>
            ))}
        
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TotalTable;

