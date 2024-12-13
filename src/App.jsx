import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Notification from './components/Notification.jsx';
import ShortsList from './components/ShortsList.jsx';
import AddShorts from './components/AddShorts.jsx';
import EditShorts from './components/EditShorts.jsx';

const App = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Notification notification={notification} />
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ShortsList />} />
            <Route 
              path="/add" 
              element={<AddShorts showNotification={showNotification} />} 
            />
            <Route 
              path="/edit/:id" 
              element={<EditShorts showNotification={showNotification} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;