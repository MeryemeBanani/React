import { useState } from 'react';

function TestCounter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '1rem', background: '#e0f7fa', borderRadius: '8px' }}>
      <h2>Contatore di Test</h2>
      <button onClick={() => setCount(prev => prev + 1)}>➕ Aumenta</button>
      <p>Valore: {count}</p>
    </div>
  );
}

export default TestCounter;
