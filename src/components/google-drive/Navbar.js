import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  return (
    // the expand sm prevents Navbar from getting the 3 dots to expand it on smaller screens
    <Navbar bg='light' expand="sm"> 
      <Navbar.Brand as={Link} to="/" >Drive</Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/user">Profile</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
