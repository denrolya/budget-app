import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';
import LoadingButton from 'src/components/LoadingButton';

import { isOnDashboardPage } from 'src/utils/routing';
import AddNewButton from 'src/components/AddNewButton';
import logo from 'src/assets/img/logo.png';

const Header = ({
  onTokenCopyClick,
  onMonobankButtonClick,
  isMonobankHookRequestInProgress,
  isSidebarOpened,
  toggleDarkMode,
  toggleSidebar,
  toggleTransactionModal,
  logoutUser,
  updateStatistics,
  isOpened,
  toggle,
}) => (
  <Navbar
    expand="lg"
    className={cn('navbar-absolute', 'pl-0', {
      'navbar-transparent': !isOpened,
      'bg-dark': isOpened,
    })}
  >
    <div className="d-flex justify-content-between w-100">
      <div className="navbar-wrapper">
        <div
          className={cn('navbar-toggle d-inline', {
            toggled: isSidebarOpened,
          })}
        >
          <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <NavbarBrand
          href="#"
          className="mx-0"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <span
            className="d-block d-sm-none"
            onClick={() => {
              if (isOnDashboardPage()) {
                updateStatistics();
              }
            }}
          >
            Budget
          </span>
        </NavbarBrand>
        <div className="clearfix" />
      </div>

      <div className="d-flex align-center">
        <LoadingButton
          type="button"
          color="secondary"
          label="monobank"
          size="sm"
          className="btn-round"
          isLoading={isMonobankHookRequestInProgress}
          onClick={onMonobankButtonClick}
        />
        <AddNewButton size="sm" onClick={toggleTransactionModal} />
        <button
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-target="#navigation"
          data-toggle="collapse"
          id="navigation"
          type="button"
          aria-expanded={false}
          onClick={toggle}
        >
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </button>

        <Collapse navbar isOpen={isOpened}>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle nav caret color="default" data-toggle="dropdown" onClick={(e) => e.preventDefault()}>
                <div className="photo">
                  <img alt="Budget app logo" src={logo} />
                </div>
                <b className="caret d-none d-lg-block d-xl-block" />
                <p className="d-lg-none">User Menu</p>
              </DropdownToggle>
              <DropdownMenu right className="dropdown-navbar" tag="ul">
                <NavLink tag="li">
                  <DropdownItem tag="button" onClick={toggleDarkMode}>
                    Toggle Dark Mode
                  </DropdownItem>
                </NavLink>
                <NavLink tag="li">
                  <DropdownItem tag="button" onClick={onTokenCopyClick}>
                    Copy Bearer code
                  </DropdownItem>
                </NavLink>
                <NavLink tag="li">
                  <DropdownItem tag="a" href="/profile">
                    Profile
                  </DropdownItem>
                </NavLink>
                <DropdownItem divider tag="li" />
                <NavLink tag="li">
                  <DropdownItem tag="a" href="#" onClick={logoutUser}>
                    Log out
                  </DropdownItem>
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
            <li className="separator d-lg-none" />
          </Nav>
        </Collapse>
      </div>
    </div>
  </Navbar>
);

Header.defaultProps = {
  isMonobankHookRequestInProgress: false,
};

Header.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  isSidebarOpened: PropTypes.bool.isRequired,
  isMonobankHookRequestInProgress: PropTypes.bool,
  logoutUser: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleTransactionModal: PropTypes.func.isRequired,
  updateStatistics: PropTypes.func.isRequired,
  onTokenCopyClick: PropTypes.func.isRequired,
  onMonobankButtonClick: PropTypes.func.isRequired,
};

export default Header;
