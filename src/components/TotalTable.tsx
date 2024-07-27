// import React, { useState, useEffect } from 'react';
// import './TotalTable.css';

// interface TotalTableProps {
//   data: { item: string; price: number; portions: number[]; price_per_portion: number; }[];
//   names: string[];
// }

// const TotalTable: React.FC<TotalTableProps> = ({ data, names }) => {
    
//   const [subtotalCombined, setSubtotalCombined] = useState<number>(0);
//   const [subtotals, setSubtotals] = useState<number[]>([]);
//   const [taxCombined, setTaxCombined] = useState<number>(0);
//   const [taxes, setTaxes] = useState<number[]>([]);
//   const [totalCombined, setTotalCombined] = useState<number>(0);
//   const [totals, setTotals] = useState<number[]>([]);

//   const calculateTotalTable = (taxCombined: number) => {
//     const newSubtotalCombined = data.reduce((sum, item) => sum + item.price, 0);
//     setSubtotalCombined(newSubtotalCombined);
//     setTotalCombined(newSubtotalCombined + taxCombined);
    
//     const newSubtotals = Array(names.length).fill(0);
//     data.forEach(item => {
//       const totalPortions = item.portions.reduce((sum, portion) => sum + portion, 0);
//       item.portions.forEach((portion, index) => {
//         newSubtotals[index] += totalPortions === 0 ? 0 : (item.price * portion / totalPortions);
//       });
//     });
//     setSubtotals(newSubtotals);
    
//     const newTaxes = newSubtotals.map((subtotal) => 
//       newSubtotalCombined === 0 ? 0 : taxCombined * subtotal / newSubtotalCombined
//     );
//     setTaxes(newTaxes);

//     const newTotals = newSubtotals.map((subtotal, index) => subtotal + newTaxes[index]);
//     setTotals(newTotals);
//   };

//   const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const taxInput = parseFloat(e.target.value) || 0;
//     setTaxCombined(taxInput);
//     calculateTotalTable(taxInput);
//   };

//   useEffect(() => {
//     calculateTotalTable(taxCombined);
//   }, [data, names, taxCombined]);

//   return (
//     <div className="total-table-container">
//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th></th>
//             {names.map((name, index) => (
//               <th key={index}>{name === '' ? "Name" : name}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>Subtotal</td>
//             <td>{subtotalCombined.toFixed(2)}</td>
//             {subtotals.map((subTotal, index) => (
//               <td key={index}>{subTotal.toFixed(2)}</td>
//             ))}
//           </tr>
//           <tr>
//             <td>Tax</td>
//             <td>
//               <input type="number" placeholder="Tax" step="any" onChange={(e) => handleTaxChange(e)} />
//             </td>
//             {taxes.map((tax, index) => (
//               <td key={index}>{tax.toFixed(2)}</td>
//             ))}
//           </tr>
//           <tr>
//             <td>Total</td>
//             <td>{totalCombined.toFixed(2)}</td>
//             {totals.map((total, index) => (
//               <td key={index} style={{ fontWeight: 'bold' }}>{total.toFixed(2)}</td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TotalTable;



import React, { useState, useEffect, useCallback } from 'react';
import './TotalTable.css';

interface TotalTableProps {
  data: { item: string; price: number; portions: number[]; price_per_portion: number; }[];
  names: string[];
}

const TotalTable: React.FC<TotalTableProps> = ({ data, names }) => {
    
  const [subtotalCombined, setSubtotalCombined] = useState<number>(0);
  const [subtotals, setSubtotals] = useState<number[]>([]);
  const [taxCombined, setTaxCombined] = useState<number>(0);
  const [taxes, setTaxes] = useState<number[]>([]);
  const [totalCombined, setTotalCombined] = useState<number>(0);
  const [totals, setTotals] = useState<number[]>([]);

  const calculateTotalTable = useCallback((taxCombined: number) => {
    const newSubtotalCombined = data.reduce((sum, item) => sum + item.price, 0);
    setSubtotalCombined(newSubtotalCombined);
    setTotalCombined(newSubtotalCombined + taxCombined);
    
    const newSubtotals = Array(names.length).fill(0);
    data.forEach(item => {
      const totalPortions = item.portions.reduce((sum, portion) => sum + portion, 0);
      item.portions.forEach((portion, index) => {
        newSubtotals[index] += totalPortions === 0 ? 0 : (item.price * portion / totalPortions);
      });
    });
    setSubtotals(newSubtotals);
    
    const newTaxes = newSubtotals.map((subtotal) => 
      newSubtotalCombined === 0 ? 0 : taxCombined * subtotal / newSubtotalCombined
    );
    setTaxes(newTaxes);

    const newTotals = newSubtotals.map((subtotal, index) => subtotal + newTaxes[index]);
    setTotals(newTotals);
  }, [data, names]);

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxInput = parseFloat(e.target.value) || 0;
    setTaxCombined(taxInput);
    calculateTotalTable(taxInput);
  };

  useEffect(() => {
    calculateTotalTable(taxCombined);
  }, [data, names, taxCombined, calculateTotalTable]);

  return (
    <div className="total-table-container">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            {names.map((name, index) => (
              <th key={index}>{name === '' ? "Name" : name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>{subtotalCombined.toFixed(2)}</td>
            {subtotals.map((subTotal, index) => (
              <td key={index}>{subTotal.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Tax</td>
            <td>
              <input type="number" placeholder="Tax" step="any" onChange={(e) => handleTaxChange(e)} />
            </td>
            {taxes.map((tax, index) => (
              <td key={index}>{tax.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td>{totalCombined.toFixed(2)}</td>
            {totals.map((total, index) => (
              <td key={index} style={{ fontWeight: 'bold' }}>{total.toFixed(2)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TotalTable;
