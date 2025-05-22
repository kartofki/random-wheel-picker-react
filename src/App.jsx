import { useState } from 'react';
import './App.css';
import ChartWheel from '../components/ChartWheel';

function App() {
  const [input, setInput] = useState("");
  const [names, setNames] = useState([]);
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const handleInputChange = (e) => {
    const rawInput = e.target.value;
    setInput(rawInput);

    const parsedNames = rawInput
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .slice(0, 10);

    setNames(parsedNames);
  };

  const resetAll = () => {
    setInput("");
    setNames([]);
    setWinner(null);
  };

  return (
    <div className="App">
      <h1 style={{paddingBottom: '40px'}}>Name Picker Wheel</h1>
    <div className="pageContainer">

      <ChartWheel
  names={names}
  onPick={(picked) => {
    setWinner(picked);
    setSpinning(false);
    setShowWinner(true);
  }}
  setSpinning={setSpinning}
/>

        <div className="inputField">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter names separated by commas (10 maximum)"
          style={{ width: '400px', padding: '8px' }}
        />
        
<button
  onClick={resetAll}
  disabled={spinning}
  style={{ padding: '8px 16px', opacity: spinning ? 0.6 : 1, cursor: spinning ? 'not-allowed' : 'pointer' }}
>
  ↻ Reset
</button>

      </div>

    {showWinner && (
  <div className="winner-overlay">
    <div className="winner-modal">
      <h2>🎉 Winner: {winner}!</h2>
      <button onClick={() => setShowWinner(false)}>Close</button>
    </div>
  </div>
)}
    </div>
    </div>
  );
}

export default App;
