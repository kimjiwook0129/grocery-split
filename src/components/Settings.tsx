import React from 'react';
import './Settings.css';

interface SettingsProps {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  items: number;
  setItems: React.Dispatch<React.SetStateAction<number>>;
  people: number;
  setPeople: React.Dispatch<React.SetStateAction<number>>;
  exportTable: () => void;
}

const currencies = ['USD', 'CAD', 'WON'];

const Settings: React.FC<SettingsProps> = ({
  currency,
  setCurrency,
  items,
  setItems,
  people,
  setPeople,
  exportTable,
}) => {
  const addItem = () => {
    if (items < 100) {
      setItems(items + 1);
    }
  };
  const removeItem = () => setItems(items > 1 ? items - 1 : 1);

  const addPerson = () => {
    if (people < 10) {
      setPeople(people + 1);
    }
  };
  const removePerson = () => setPeople(people > 1 ? people - 1 : 1);

  return (
    <div className="settings-container">
      <div className="setting-item">
        <label htmlFor="currency">Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
      
      <div className="setting-item">
        <label htmlFor="items">Items:</label>
        <div className="item-controls">
          <input type="text" id="items" value={items} readOnly />
          <button onClick={addItem}>+</button>
          <button onClick={removeItem}>-</button>
        </div>
      </div>
      
      <div className="setting-item">
        <label htmlFor="people">People to Split:</label>
        <div className="item-controls">
          <input type="text" id="people" value={people} readOnly />
          <button onClick={addPerson}>+</button>
          <button onClick={removePerson}>-</button>
        </div>
      </div>
      
      <div className="setting-item">
        <button onClick={exportTable} disabled>Export Table</button>
      </div>
    </div>
  );
};

export default Settings;
