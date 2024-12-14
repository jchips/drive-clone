import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CenteredContainer from './CenteredContainer';

const Login = () => {
  const { login, logout, emailVerification } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Prevents users from continously clicking signup button and creating multiple accts.
  const navigate = useNavigate();

  /**
   * Logs in user if they have an account.
   * Logs user out (if their email is not verified).
   * @param {Event} e - THe submit event when a user presses 'log in'
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents instant refresh
    let email = e.target.email.value;
    let password = e.target.password.value;

    try {
      setError('');
      setLoading(true);
      let userCredential = await login(email, password);
      console.log(userCredential); // delete later

      if (userCredential.user.emailVerified) {
        navigate('/');
      } else {
        setError('Email not verified. Check your email inbox to verify email.');
        verifyEmail(userCredential.user);
        logoutUser();
      }
      // await login(email, password);
      // navigate("/");
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    }
    setLoading(false);
  }

  // Logs user out
  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Sends the recently signed up user a verification email
   * @param {Object} user - The info of the user who signed up
   */
  const verifyEmail = async (user) => {
    try {
      await emailVerification(user);
    } catch (err) {
      setError('Could not verify email');
    }
  }
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Log In</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
        </Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='email' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' required />
          </Form.Group>
          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' required />
          </Form.Group>
          <Button type='submit' className='w-100' disabled={loading}>Log In</Button>
        </Form>
        <div className='w-100 text-center mt-3'>
          <Link to='/forgot-password'>Forgot Password?</Link>
        </div>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </CenteredContainer>
  );
}

export default Login;

