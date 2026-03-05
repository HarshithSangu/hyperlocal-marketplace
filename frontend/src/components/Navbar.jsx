import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export function Navbar() {
  const { user } = useAuth();
  const { unreadCount, lastNotification } = useChat();

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

        {user && (
          <div style={{ position: 'relative', marginLeft: '1.5rem' }}>
            <span style={{ cursor: 'default' }}>
              🔔{unreadCount > 0 ? ` (${unreadCount})` : ''}
            </span>
            {lastNotification && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '2.5rem',
                  backgroundColor: 'white',
                  color: '#1f2933',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  fontSize: '0.8rem',
                  maxWidth: '220px',
                  zIndex: 50,
                }}
              >
                New message from {lastNotification.senderName || 'Seller'}
              </div>
            )}
          </div>
        )}
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
