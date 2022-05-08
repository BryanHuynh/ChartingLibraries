import logo from './logo.svg';
import { Graph } from './components/chart.tsx';
import { Canvas } from './components/Canvas/Canvas.tsx';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Elevation Profile Tool</h1>
        <Graph />
        {/* <Canvas /> */}
    </div>
  );
}

export default App;
