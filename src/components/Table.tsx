import React, { useEffect, useState } from 'react';
import './Table.css';

interface TableProps {
  items: number;
  people: number;
  onDataChange: (data: { price: number; portions: number[] }[]) => void;
}

const Table: React.FC<TableProps> = ({ items, people, onDataChange }) => {
  const columns = ['Item', 'Price', ...Array.from({ length: people }, (_, i) => `Name${i + 1}`), 'Amt/Portion'];
  const [tableData, setTableData] = useState<{ price: number; portions: number[] }[]>([]);

  useEffect(() => {
    onDataChange(tableData);
  }, [tableData, onDataChange]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
    const price = parseFloat(e.target.value) || 0;
    const newTableData = [...tableData];
    newTableData[rowIndex].price = price;
    setTableData(newTableData);
  };

  const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const portion = parseFloat(e.target.value) || 0;
    const newTableData = [...tableData];
    newTableData[rowIndex].portions[colIndex - 2] = portion;
    setTableData(newTableData);
  };

  useEffect(() => {
    const initialData = Array.from({ length: items }, () => ({
      price: 0,
      portions: Array(people).fill(0),
    }));
    setTableData(initialData);
  }, [items, people]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentInput = e.target as HTMLInputElement;
    const currentCell = currentInput.closest('td');
    const currentRow = currentInput.closest('tr');
    
    if (currentCell && currentRow) {
      const currentCellIndex = Array.from(currentRow.children).indexOf(currentCell);
      let nextInput: HTMLInputElement | null = null;

      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextRow = currentRow.nextElementSibling as HTMLTableRowElement;
        if (nextRow) {
          nextInput = nextRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevRow = currentRow.previousElementSibling as HTMLTableRowElement;
        if (prevRow) {
          nextInput = prevRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextCell = currentCell.nextElementSibling as HTMLTableCellElement;
        if (nextCell) {
          nextInput = nextCell.querySelector('input') as HTMLInputElement;
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevCell = currentCell.previousElementSibling as HTMLTableCellElement;
        if (prevCell) {
          nextInput = prevCell.querySelector('input') as HTMLInputElement;
        }
      }

      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {index > 1 && index < columns.length - 1 ? <input type="text" placeholder="Name" onKeyDown={handleKeyDown} /> : column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: items }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {colIndex === 0 ? <input type="text" onKeyDown={handleKeyDown} placeholder={rowIndex === 0 ? "Item" : ""} /> : ''}
                  {colIndex === 1 ? <input type="number" min="0" onKeyDown={handleKeyDown} placeholder={rowIndex === 0 ? "Price" : ""} step="any" onChange={(e) => handlePriceChange(e, rowIndex)} /> : ''}
                  {colIndex > 1 && colIndex < columns.length - 1 ? (
                    <input type="number" min="0" step="any" onKeyDown={handleKeyDown} placeholder={rowIndex === 0 ? "Portion" : ""} className="portion-input" onChange={(e) => handlePortionChange(e, rowIndex, colIndex)} />
                  ) : ''}
                  {colIndex === columns.length - 1 ? <span className="amount">0</span> : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

