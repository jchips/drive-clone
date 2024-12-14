import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CenteredContainer from './CenteredContainer';

const UpdateLogin = () => {
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Prevents users from continously clicking signup button and creating multiple accts.
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents instant refresh
    let email = e.target.email.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    const promises = [];
    setLoading(true);
    setError('');
    

    // If the email addresses are changed, make sure to add the change to the promises[] array
    if (email !== currentUser.email) {
      promises.push(updateEmail(email));
    }
    
    // If a password is entered, adds the change to the promises[] array. 
    // If a password isn't entered, the password will not change.
    if (password) {
      promises.push(updatePassword(password));
    }

    // Runs async stuff simultaneously
    Promise.all(promises)
      .then(() => navigate('/user'))
      .catch(err => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Login</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
        </Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='email' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' defaultValue={currentUser.email} required />
          </Form.Group>
          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Leave blank to keep the same' />
          </Form.Group>
          <Form.Group controlId='confirmPassword' className='mb-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' placeholder='Leave blank to keep the same' />
          </Form.Group>
          <Button type='submit' className='w-100' disabled={loading}>Update</Button>
        </Form>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link to='/user'>Cancel</Link>
      </div>
    </CenteredContainer>
  );
}

export default UpdateLogin;

