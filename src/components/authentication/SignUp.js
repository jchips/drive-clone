import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CenteredContainer from './CenteredContainer';

const SignUp = () => {
  const { signup, emailVerification, logout } = useAuth();
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

    try {
      setError('');
      setLoading(true);
      let userCredential = await signup(email, password); // sign new user up
      verifyEmail(userCredential.user); // send user a verification email
      logoutUser();
      navigate('/verify-email');
    } catch (err) {
      setError('Failed to create an account. Make sure your password is at least 7 characters.');
      console.error(err);
    }
    setLoading(false);
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

  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign Up</h2>
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
          <Form.Group controlId='confirmPassword' className='mb-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' required />
          </Form.Group>
          <Button type='submit' className='w-100' disabled={loading}>Sign Up</Button>
        </Form>
      </Card>
      <div className='w-100 text-center mt-2'>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </CenteredContainer>
  );
}

export default SignUp;
