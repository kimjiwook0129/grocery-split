import React, { useState } from 'react';
import './App.css';
import Settings from './components/Settings';
import Table from './components/Table';
import TotalTable from './components/TotalTable';

const currencies = ['CAD', 'USD', 'WON'];

const App: React.FC = () => {
  const [currency, setCurrency] = useState<string>(currencies[0]);
  const [items, setItems] = useState<number>(1);
  const [people, setPeople] = useState<number>(1);
  const [data, setData] = useState<{ price: number; portions: number[] }[]>([]);

  const handleDataChange = (newData: { price: number; portions: number[] }[]) => {
    setData(newData);
  };

  const exportTable = () => {
    // Implement the downloading feature here later
    console.log('Exporting table...');
  };

  const columns = ['Item', 'Price', ...Array.from({ length: people }, (_, i) => `Name${i + 1}`), 'Amt/Portion'];

  return (
    <div className="App">
      <h1>GrocerySplit</h1>
      <Settings
        currency={currency}
        setCurrency={setCurrency}
        items={items}
        setItems={setItems}
        people={people}
        setPeople={setPeople}
        exportTable={exportTable}
      />
      <Table items={items} people={people} onDataChange={handleDataChange} />
      <TotalTable items={items} people={people} columns={columns} data={data} />
    </div>
  );
};

export default App;
