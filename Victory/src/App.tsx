import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { Chart } from './Components/Chart'
import { AreaChart } from './Components/AreaChart'
function App() {
  return (
    <div className="App" style={{height: '100vh'}}>
      {/* <Chart/> */}
      <AreaChart/>
    </div>
  );
}

export default App;
