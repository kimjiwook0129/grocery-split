import React, { useState, useEffect } from 'react';
import './TotalTable.css';

interface TotalTableProps {
  data: { item: string; price: number; portions: number[]; price_per_portion: number; }[];
  names: string[];
}

const TotalTable: React.FC<TotalTableProps> = ({ data, names }) => {
  // 받은 데이터로만 하면 된다
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [subTotals, setSubtotals] = useState<number[]>(Array(names.length).fill(0));
  const [taxes, setTaxes] = useState<number[]>(Array(names.length).fill(0));
  const [totals, setTotals] = useState<number[]>(Array(names.length).fill(0));

  console.log(data, names);
  
  useEffect(() => {
    let subtotalSum = 0;
    let subTotals = Array(names.length).fill(0);
    let taxes = Array(names.length).fill(0);
    let totals = Array(names.length).fill(0);

    data.forEach(row => {
      subtotalSum += row.price;
      const totalPortion = row.portions.reduce((sum, portion) => sum + portion, 0);
      row.portions.forEach((portion, colIndex) => {
        subTotals[colIndex] += row.price * (portion / totalPortion);
      });
    });
    setSubtotal(subtotalSum);
    setTotal(subtotalSum + tax);
    setSubtotals(subTotals);

    subTotals.forEach((_subtotal, colIndex) => {
      taxes[colIndex] = tax * (_subtotal / subtotalSum)
    });
    setTaxes(taxes);

    subTotals.forEach((_subtotal, colIndex) => {
      totals[colIndex] = total * (_subtotal / subtotalSum)
    });
    setTotals(totals);
  }, [ data]);

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxInput = parseFloat(e.target.value) || 0;
    setTax(taxInput);

    let taxes = Array(names.length).fill(0);
    subTotals.forEach((_subtotal, colIndex) => {
      taxes[colIndex] = tax * (_subtotal / subtotal)
    });
    setTaxes(taxes)
  }

  return (
    <div className="total-table-container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            {names.map((name, index) => (
              <th key={index}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>{subtotal.toFixed(2)}</td>
            {subTotals.map((subTotal, index) => (
              <td key={index}>{subTotal.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Tax</td>
            <td>
              <input
                type="number"
                onChange={(e) => handleTaxChange(e)}
              />
            </td>
            {taxes.map((tax, index) => (
              <td key={index}>{tax.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td>{total.toFixed(2)}</td>
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

