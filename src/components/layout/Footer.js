import React from 'react';
import {
  Container, Nav, NavItem, NavLink,
} from 'reactstrap';

const Footer = (props) => (
  <footer className="footer">
    <Container fluid>
      <Nav>
        <NavItem>
          <NavLink href="javascript:void(0)">Creative Tim</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="javascript:void(0)">About Us</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="javascript:void(0)">Blog</NavLink>
        </NavItem>
      </Nav>
      <div className="copyright">
        ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        made with
        {' '}
        <i className="tim-icons icon-heart-2" />
        {' '}
        by
        {' '}
        <a href="javascript:void(0)" rel="noopener noreferrer" target="_blank">
          Creative Tim
        </a>
        {' '}
        for a better web.
      </div>
    </Container>
  </footer>
);

export default Footer;
