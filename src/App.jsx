import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/home'; // Ensure file name matches

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/:id' element={<Homepage />} />
        <Route path='*' element={<p>404 Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
