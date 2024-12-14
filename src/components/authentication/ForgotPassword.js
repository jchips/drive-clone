import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import CenteredContainer from './CenteredContainer';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Prevents users from continously clicking signup button and creating multiple accts.
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents instant refresh
    let email = e.target.email.value

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email inbox for further instructions');
    } catch (err) {
      setError('Failed to reset password');
      console.error(err);
    }
    setLoading(false);
  }
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Password Reset</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          {message && <Alert variant='success'>{message}</Alert>}
        </Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='email' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' required />
          </Form.Group>
          <Button type='submit' className='w-100' disabled={loading}>Reset Password</Button>
        </Form>
        <div className='w-100 text-center mt-3'>
          <Link to='/login'>Log In</Link>
        </div>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </CenteredContainer>
  );
}

export default ForgotPassword;


