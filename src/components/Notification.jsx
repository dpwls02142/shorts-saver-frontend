import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const Notification = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center 
      ${notification.type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'}`}>
      {notification.type === 'success' 
        ? <CheckCircle2 className="mr-2" /> 
        : <AlertCircle className="mr-2" />}
      {notification.message}
    </div>
  );
};

export default Notification;