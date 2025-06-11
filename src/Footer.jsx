import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import './style.css';

class Footer extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Brand><p>&copy; Paul Disney 2025</p></Navbar.Brand>
      </Navbar>
    )
  }
}

export default Footer;
