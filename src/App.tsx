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
  const [data, setData] = useState<{ item: string; price: number; portions: number[]; price_per_portion: number; }[]>([]);
  const [names, setNames] = useState<string[]>([]);

  const handleDataChange = (
    newData: {item: string; price: number; portions: number[]; price_per_portion: number; }[],
    newNames: string[]
    ) => {
    setData(newData);
    setNames(newNames);
  };

  const exportTable = () => {
    // Implement the downloading feature here later
    console.log('Exporting table...');
  };

  return (
    <div className="App">
      <div className="title-container">
        <h1>GrocerySplit</h1><img src="image.png" alt="GrocerySplit Image"></img>
      </div>
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
      <TotalTable data={data} names={names}/>
    </div>
  );
};

export default App;
