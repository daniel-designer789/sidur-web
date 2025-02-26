import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Graphs from './pages/Graphs';
import './styles/sidebar.css';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/graphs" element={<Graphs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 