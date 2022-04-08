import logo from './logo.svg';
import { Login } from './components/Login';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Login />
    </div>
  );
}

export default App;
