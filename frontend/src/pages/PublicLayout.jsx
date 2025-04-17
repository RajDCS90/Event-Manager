// Create a new component: src/components/common/PublicLayout.jsx
import React, { useState } from 'react';
import Header from '../components/Landing/Header';

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMenuOpen={isMenuOpen} 
        setShowRegisterForm={setShowRegisterForm} 
        setIsMenuOpen={setIsMenuOpen} 
      />
      {/* <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} /> */}
      {children}
    </div>
  );
};

export default PublicLayout;