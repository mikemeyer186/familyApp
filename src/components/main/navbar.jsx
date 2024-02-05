import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/userContext';
import { Popover } from 'bootstrap'; // eslint-disable-line no-unused-vars

export default function Navbar() {
    const { activeUser, signOutUser } = useUser();
    const [greeting, setGreeting] = useState('Hallo');
    const userID = activeUser.uid;
    const isGuest = userID === import.meta.env.VITE_GUEST_ID;
    const navigate = useNavigate();

    /**
     * handles sign out of user
     */
    function handleSignOut() {
        signOutUser();
    }

    /**
     * handles navigation in menu dropdown
     * @param {string} route - route to navigate to
     */
    function handleDropdownNav(route) {
        navigate(route);
    }

    /**
     * checks daytime and sets greeting in navbar
     */
    function checkDaytime() {
        let daytime = new Date();
        let hours = daytime.getHours();
        if (hours >= 6 && hours < 11) {
            setGreeting('Guten Morgen');
        } else if (hours >= 11 && hours < 17) {
            setGreeting('Guten Tag');
        } else if (hours >= 17 && hours <= 23) {
            setGreeting('Guten Abend');
        }
    }

    /**
     * checks daytime on page load
     */
    useEffect(() => {
        checkDaytime();
    }, []);

    return (
        <>
            <div className="navbar-container">
                <nav className="navbar fixed-top navbarBg">
                    <div className="container-fluid">
                        <div className="navbar-logo">
                            <img className="navbar-logo-img" src="/assets/img/logo_blue.png" alt="Logo" />
                            <span className="navbar-brand">familyApp</span>
                        </div>
                        <button
                            className="navbar-toggler navbarMenuIcon"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar"
                            aria-controls="offcanvasNavbar"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                            <div className="offcanvas-header">
                                <div className="offcanvas-user">
                                    <img
                                        src={activeUser.photoURL ? activeUser.photoURL : '/assets/img/profile-picture.png'}
                                        className="offcanvas-image"
                                        alt="User image"
                                    />
                                    <h4 className="offcanvas-title" id="offcanvasNavbarLabel">
                                        {greeting}
                                        {activeUser.displayName ? ', ' + activeUser.displayName + '!' : ''}
                                    </h4>
                                </div>
                                <button type="button" className="btn-close iconClickable" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                    <li data-bs-dismiss="offcanvas">
                                        <NavLink to="dashboard?page=Dashboard" className="nav-item">
                                            <img src="/assets/icons/clipboard-data.svg" alt="Dashboard" />
                                            <span className="nav-link">Dashboard</span>
                                        </NavLink>
                                    </li>
                                    <li data-bs-dismiss="offcanvas">
                                        <NavLink to="lists?page=Listen" className="nav-item">
                                            <img src="/assets/icons/card-checklist.svg" alt="Listen" />
                                            <span className="nav-link">Listen</span>
                                        </NavLink>
                                    </li>
                                    <li data-bs-dismiss="offcanvas">
                                        <NavLink to="journal?page=Journal" className="nav-item">
                                            <img src="/assets/icons/cash-coin.svg" alt="Journal" />
                                            <span className="nav-link">Journal</span>
                                        </NavLink>
                                    </li>
                                    <li data-bs-dismiss="offcanvas">
                                        <NavLink to="calendar?page=Kalender" className="nav-item">
                                            <img src="/assets/icons/calendar3.svg" alt="Kalender" />
                                            <span className="nav-link">Kalender</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <hr className="nav-divider" />
                                    </li>
                                    <li className="nav-item dropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                                        <img src="/assets/icons/person-gear.svg" alt="Profil" />
                                        <span className="nav-link dropdown-toggle">Benutzerprofil</span>
                                        <ul className="dropdown-menu dropdown-menu-offcanvas">
                                            <li data-bs-dismiss="offcanvas">
                                                <span
                                                    className="dropdown-item pointer"
                                                    onClick={() => handleDropdownNav('userprofile?page=Benutzerprofil')}
                                                >
                                                    Profil bearbeiten
                                                </span>
                                            </li>
                                            <li data-bs-dismiss={isGuest && ''}>
                                                <span
                                                    className={`dropdown-item pointer ${isGuest && 'not-allowed'}`}
                                                    onClick={() => {
                                                        if (!isGuest) {
                                                            handleDropdownNav('emailchange?page=E-Mail Adresse ändern');
                                                        }
                                                    }}
                                                >
                                                    E-Mail Adresse ändern
                                                </span>
                                            </li>
                                            <li data-bs-dismiss={isGuest && ''}>
                                                <span
                                                    className={`dropdown-item pointer ${isGuest && 'not-allowed'}`}
                                                    onClick={() => {
                                                        if (!isGuest) {
                                                            handleDropdownNav('passwordchange?page=Password ändern');
                                                        }
                                                    }}
                                                >
                                                    Passwort ändern
                                                </span>
                                            </li>
                                        </ul>
                                    </li>
                                    <li data-bs-dismiss="offcanvas">
                                        <NavLink to="settings?page=Einstellungen" className="nav-item">
                                            <img src="/assets/icons/gear.svg" alt="Einstellungen" />
                                            <span className="nav-link">Einstellungen</span>
                                        </NavLink>
                                    </li>
                                    <li data-bs-dismiss="offcanvas">
                                        <NavLink to="problem?page=Problem" className="nav-item">
                                            <img src="/assets/icons/chat-right-dots.svg" alt="Problem" />
                                            <span className="nav-link">Problem melden</span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item" onClick={handleSignOut} data-bs-dismiss="offcanvas">
                                        <img src="/assets/icons/door-open.svg" alt="Logout" />
                                        <span className="nav-link pointer">Abmelden</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
