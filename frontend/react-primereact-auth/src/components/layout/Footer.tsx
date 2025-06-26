import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#093FB4', color: '#ffffff', padding: '1rem', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </footer>
  );
};

export default Footer;