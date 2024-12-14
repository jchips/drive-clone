import React, { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CenteredContainer from './CenteredContainer';

const Profile = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to log out');
      console.error(err);
    }
  }
  return (
    <CenteredContainer className='profile'>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Profile</h2>
          {error && <Alert>{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
          <Link to='/update-login' className='btn btn-primary w-100 mt-3'>Update Login</Link>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Button variant='link' onClick={handleLogout}>Log Out</Button>
      </div>
    </CenteredContainer>
  );
}

export default Profile;
