import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav style={navStyle}>
      <div style={navBrandStyle}>Hyperlocal</div>
      <div style={navLinksStyle}>
        {user?.role === 'user' && <Link to="/search" style={linkStyle}>Search</Link>}
        {user?.role === 'seller' && (
          <>
            <Link to="/search" style={linkStyle}>Search</Link>
            <Link to="/seller" style={linkStyle}>Dashboard</Link>
          </>
        )}
        {user?.role === 'admin' && <Link to="/admin" style={linkStyle}>Admin</Link>}
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#667eea',
  color: 'white',
  padding: '1rem',
  marginBottom: '1rem',
};

const navBrandStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const navLinksStyle = {
  display: 'flex',
  gap: '2rem',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
};
