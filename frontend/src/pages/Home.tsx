import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };  return (
    <div className="full-viewport" style={{ backgroundColor: '#f8f9fa', padding: '2rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1rem' }}>
        <Card style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#212529' }}>
            Welcome to Demo App
          </h1>
          
          {isAuthenticated && user ? (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#093FB4' }}>
                Hello, {user.fullName}!
              </h2>
              <p style={{ fontSize: '1rem', color: '#6c757d', marginBottom: '1rem' }}>
                Email: {user.email}
              </p>
              <p style={{ fontSize: '1rem', color: '#28a745', marginBottom: '2rem' }}>
                ✅ You are successfully logged in!
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '2rem' }}>
              This is a demo application built with React, TypeScript, and PrimeReact.
            </p>
          )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Button
                  label="Products"
                  icon="pi pi-box"
                  onClick={() => navigate('/products')}
                />
                <Button
                  label="Logout"
                  icon="pi pi-sign-out"
                  severity="secondary"
                  onClick={handleLogout}
                />
              </>
            ) : (
              <>
                <Button
                  label="Go to Login"
                  icon="pi pi-sign-in"
                  onClick={() => navigate('/login')}
                />
                <Button
                  label="Go to Register"
                  icon="pi pi-user-plus"
                  severity="secondary"
                  onClick={() => navigate('/register')}
                />
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
