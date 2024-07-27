import React, { useEffect, useState, useRef } from 'react';
import './Table.css';

interface TableProps {
  items: number;
  people: number;
  onDataChange: (data: { item: string; price: number; portions: number[]; price_per_portion: number; }[], names: string[]) => void;
}

const Table: React.FC<TableProps> = ({ items, people, onDataChange }) => {
  const columns = ['Item', 'Price', ...Array.from({ length: people }, (_, i) => `Name${i + 1}`), 'Price/Portion'];
  const [tableData, setTableData] = useState<{ item: string; price: number; portions: number[]; price_per_portion: number; }[]>([]);
  const [namesData, setNamesData] = useState<string[]>([]);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());

  useEffect(() => {
    onDataChange(tableData, namesData);
  }, [tableData, namesData, onDataChange]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, colIndex: number) => {
    const newNamesData = [...namesData];
    const name = e.target.value;
    newNamesData[colIndex - 2] = name;
    setNamesData(newNamesData);
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newTableData = [...tableData];
    if (colIndex === 0) {
      const item = e.target.value || '';
      newTableData[rowIndex].item = item;
    } else if (colIndex === 1) {
      const price = parseFloat(e.target.value) || 0;
      newTableData[rowIndex].price = price;
    } else {
      const portion = parseFloat(e.target.value) || 0;
      newTableData[rowIndex].portions[colIndex - 2] = portion;
    }
    const sumOfPortions = newTableData[rowIndex].portions.reduce((sum, portion) => sum + portion, 0);
    newTableData[rowIndex].price_per_portion = sumOfPortions === 0 ? 0 : newTableData[rowIndex].price / sumOfPortions;
    setTableData(newTableData);
  };

  useEffect(() => {
    const newTableData = Array.from({ length: items }, (_, i) => (
      i < tableData.length ? tableData[i] : { item: '', price: 0, portions: Array(people).fill(0), price_per_portion: 0 }
    )).map((data, i) => {
      const sumOfPortions = data.portions.reduce((sum, portion) => sum + portion, 0);
      return {
        ...data,
        portions: data.portions.length === people ? data.portions : Array.from({ length: people }, (_, j) => data.portions[j] || 0),
        price_per_portion: sumOfPortions === 0 ? 0 : data.price / sumOfPortions,
      };
    });
    setTableData(newTableData);

    const namesInitialData = Array.from({ length: people }, (_, i) => namesData[i] || '');
    setNamesData(namesInitialData);
  }, [items, people, tableData, namesData]);

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   const currentInput = e.target as HTMLInputElement;
  //   const currentCell = currentInput.closest('td');
  //   const currentTh = currentInput.closest('th');
  //   const currentRow = currentInput.closest('tr');

  //   if (currentTh && currentRow) {
  //     const currentThIndex = Array.from(currentRow.children).indexOf(currentTh);
  //     let nextInput: HTMLInputElement | null = null;
  //     if (e.key === 'ArrowRight') {
  //       e.preventDefault();
  //       const nextCell = currentTh.nextElementSibling as HTMLTableCellElement;
  //       if (nextCell) {
  //         nextInput = nextCell.querySelector('input') as HTMLInputElement;
  //       }
  //     } else if (e.key === 'ArrowLeft') {
  //       e.preventDefault();
  //       const prevCell = currentTh.previousElementSibling as HTMLTableCellElement;
  //       if (prevCell) {
  //         nextInput = prevCell.querySelector('input') as HTMLInputElement;
  //       }
  //     } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
  //       e.preventDefault();
  //       const nextRow = rowRefs.current.get(1);
  //       if (nextRow) {
  //         nextInput = nextRow.children[currentThIndex].querySelector('input') as HTMLInputElement;
  //       }
  //     }

  //     if (nextInput) {
  //       nextInput.focus();
  //     }
  //   } else if (currentCell && currentRow) {
  //     const currentCellIndex = Array.from(currentRow.children).indexOf(currentCell);
  //     let nextInput: HTMLInputElement | null = null;

  //     if (e.key === 'Enter' || e.key === 'ArrowDown') {
  //       e.preventDefault();
  //       const nextRow = currentRow.nextElementSibling as HTMLTableRowElement;
  //       if (nextRow) {
  //         nextInput = nextRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
  //       }
  //     } else if (e.key === 'ArrowUp') {
  //       e.preventDefault();
  //       const prevRow = currentRow.previousElementSibling as HTMLTableRowElement;
  //       if (prevRow) {
  //         nextInput = prevRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
  //       } else {
  //         const nameRow = rowRefs.current.get(0);
  //         if (nameRow) {
  //           nextInput = nameRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
  //         }
  //       }
  //     } else if (e.key === 'ArrowRight') {
  //       e.preventDefault();
  //       const nextCell = currentCell.nextElementSibling as HTMLTableCellElement;
  //       if (nextCell) {
  //         nextInput = nextCell.querySelector('input') as HTMLInputElement;
  //       }
  //     } else if (e.key === 'ArrowLeft') {
  //       e.preventDefault();
  //       const prevCell = currentCell.previousElementSibling as HTMLTableCellElement;
  //       if (prevCell) {
  //         nextInput = prevCell.querySelector('input') as HTMLInputElement;
  //       }
  //     }

  //     if (nextInput) {
  //       nextInput.focus();
  //     }
  //   }
  // };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentInput = e.target as HTMLInputElement;
    const currentCell = currentInput.closest('td');
    const currentTh = currentInput.closest('th');
    const currentRow = currentInput.closest('tr');
  
    const moveFocus = (direction: 'next' | 'prev' | 'up' | 'down') => {
      let nextInput: HTMLInputElement | null = null;
  
      if (currentTh && currentRow) {
        const currentThIndex = Array.from(currentRow.children).indexOf(currentTh);
        if (direction === 'next') {
          const nextCell = currentTh.nextElementSibling as HTMLTableCellElement;
          if (nextCell) {
            nextInput = nextCell.querySelector('input') as HTMLInputElement;
          }
        } else if (direction === 'prev') {
          const prevCell = currentTh.previousElementSibling as HTMLTableCellElement;
          if (prevCell) {
            nextInput = prevCell.querySelector('input') as HTMLInputElement;
          }
        } else if (direction === 'down') {
          const nextRow = rowRefs.current.get(1);
          if (nextRow) {
            nextInput = nextRow.children[currentThIndex].querySelector('input') as HTMLInputElement;
          }
        } else if (direction === 'up') {
          const prevRow = currentRow.previousElementSibling as HTMLTableRowElement;
          if (prevRow) {
            nextInput = prevRow.children[currentThIndex].querySelector('input') as HTMLInputElement;
          } else {
            const nameRow = rowRefs.current.get(0);
            if (nameRow) {
              nextInput = nameRow.children[currentThIndex].querySelector('input') as HTMLInputElement;
            }
          }
        }
      } else if (currentCell && currentRow) {
        const currentCellIndex = Array.from(currentRow.children).indexOf(currentCell);
        if (direction === 'next') {
          const nextCell = currentCell.nextElementSibling as HTMLTableCellElement;
          if (nextCell) {
            nextInput = nextCell.querySelector('input') as HTMLInputElement;
          }
        } else if (direction === 'prev') {
          const prevCell = currentCell.previousElementSibling as HTMLTableCellElement;
          if (prevCell) {
            nextInput = prevCell.querySelector('input') as HTMLInputElement;
          }
        } else if (direction === 'down') {
          const nextRow = currentRow.nextElementSibling as HTMLTableRowElement;
          if (nextRow) {
            nextInput = nextRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
          }
        } else if (direction === 'up') {
          const prevRow = currentRow.previousElementSibling as HTMLTableRowElement;
          if (prevRow) {
            nextInput = prevRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
          } else {
            const nameRow = rowRefs.current.get(0);
            if (nameRow) {
              nextInput = nameRow.children[currentCellIndex].querySelector('input') as HTMLInputElement;
            }
          }
        }
      }
  
      if (nextInput) {
        setTimeout(() => nextInput?.focus(), 0); // Delay focus change to handle IME properly
      }
    };
  
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus('down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus('up');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveFocus('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveFocus('prev');
    }
  };
  

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr ref={(el) => el && rowRefs.current.set(0, el)}>
            {columns.map((column, index) => (
              <th key={index}>
                {index > 1 && index < columns.length - 1 ? <input type="text" placeholder="Name" onChange={(e) => handleNameChange(e, index)} onKeyDown={handleKeyDown} /> : column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: items }, (_, rowIndex) => (
            <tr key={rowIndex} ref={(el) => el && rowRefs.current.set(rowIndex + 1, el)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {colIndex === 0 ? <input type="text" onKeyDown={handleKeyDown} onChange={(e) => handleDataChange(e, rowIndex, colIndex)} placeholder={rowIndex === 0 ? "Item" : ""} /> : ''}
                  {colIndex === 1 ? <input type="number" min="0" onKeyDown={handleKeyDown} placeholder={rowIndex === 0 ? "Price" : ""} step="any" onChange={(e) => handleDataChange(e, rowIndex, colIndex)} /> : ''}
                  {colIndex > 1 && colIndex < columns.length - 1 ? (
                    <input type="number" min="0" step="any" onKeyDown={handleKeyDown} placeholder={rowIndex === 0 ? "Portion" : ""} className="portion-input" onChange={(e) => handleDataChange(e, rowIndex, colIndex)} />
                  ) : ''}
                  {colIndex === columns.length - 1 ? <span className="amount-per-portion">{tableData[rowIndex]?.price_per_portion.toFixed(2)}</span> : ''}
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
