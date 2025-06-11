import React from 'react';
import './style.css';
import { Navbar, NavItem } from 'react-bootstrap';
import { Link } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand><h1>TravelTunes</h1></Navbar.Brand>
        <NavItem><Link to="/" className="nav-link">Home</Link></NavItem>
        <NavItem><Link to="/favorites" className="nav-link">Favorites</Link></NavItem>
        <NavItem><Link to="/contact" className="nav-link">Contact</Link></NavItem>
      </Navbar>
    );
  }
}

export default Header;
