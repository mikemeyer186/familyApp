import { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/userContext';
import { Popover } from 'bootstrap';

export default function Navbar() {
    const { activeUser, greeting, signOutUser, checkDaytime } = useUser();
    const navigate = useNavigate();
    const didInit = useRef(false);
    const offcanvasMenu = useRef(null);

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
     * removes all multiple offcanvas backdrops except index 1
     * caused by offcanvas menu rendering
     */
    function removeMultipleBackdrops() {
        document.querySelectorAll('.offcanvas-backdrop').forEach((backdrop, index) => {
            if (index !== 1) {
                backdrop.remove();
            }
        });
    }

    /**
     * checks daytime on initial loading
     */
    useEffect(() => {
        if (!didInit.current) {
            checkDaytime();
            didInit.current = true;
        }
    }, [checkDaytime]);

    /**
     * listens to show offcanvas event to remove the multiple backdrops on rendering
     */
    useEffect(() => {
        const menu = offcanvasMenu.current;
        menu.addEventListener('show.bs.offcanvas', removeMultipleBackdrops);

        return () => {
            menu.removeEventListener('show.bs.offcanvas', removeMultipleBackdrops);
        };
    }, []);

    return (
        <div className="navbar-container">
            <nav className="navbar fixed-top bg-navbar">
                <div className="container-fluid">
                    <div className="navbar-logo">
                        <img className="navbar-logo-img" src="/assets/img/logo_blue.png" alt="Logo" />
                        <span className="navbar-brand">familyApp</span>
                    </div>
                    <button
                        className="navbar-toggler navbar-menu-icon"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        ref={offcanvasMenu}
                        className="offcanvas offcanvas-end"
                        tabIndex="-1"
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                    >
                        <div className="offcanvas-header">
                            <div className="offcanvas-user">
                                <img
                                    src={activeUser.photoURL ? activeUser.photoURL : '/assets/img/profile-picture.png'}
                                    className="offcanvas-image"
                                    alt="User image"
                                />
                                <h4
                                    className={`offcanvas-title ${activeUser.displayName.length > 10 ? 'flex-column' : 'flex-row'}`}
                                    id="offcanvasNavbarLabel"
                                >
                                    <span className="title-greeting">{activeUser.displayName ? greeting + ',' : greeting}</span>
                                    <span className="title-name">{activeUser.displayName && activeUser.displayName + '!'}</span>
                                </h4>
                            </div>
                            <button type="button" className="btn-close icon-clickable" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
                                    <NavLink to="calendar?page=Kalender" className="nav-item">
                                        <img src="/assets/icons/calendar3.svg" alt="Kalender" />
                                        <span className="nav-link">Kalender</span>
                                    </NavLink>
                                </li>
                                <li data-bs-dismiss="offcanvas">
                                    <NavLink to="lists?page=Listen" className="nav-item">
                                        <img src="/assets/icons/card-checklist.svg" alt="Listen" />
                                        <span className="nav-link">Listen</span>
                                    </NavLink>
                                </li>
                                <li data-bs-dismiss="offcanvas">
                                    <NavLink to="journal?page=Finanzen" className="nav-item">
                                        <img src="/assets/icons/cash-coin.svg" alt="Finanzen" />
                                        <span className="nav-link">Finanzen</span>
                                    </NavLink>
                                </li>
                                <li data-bs-dismiss="offcanvas">
                                    <NavLink to="assistant?page=Assistent" className="nav-item">
                                        <img src="/assets/icons/robot.svg" alt="Assistent" />
                                        <span className="nav-link">Assistent</span>
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
                                        <li data-bs-dismiss="offcanvas">
                                            <span
                                                className="dropdown-item pointer"
                                                onClick={() => handleDropdownNav('emailchange?page=E-Mail ändern')}
                                            >
                                                E-Mail Adresse ändern
                                            </span>
                                        </li>
                                        <li data-bs-dismiss="offcanvas">
                                            <span
                                                className="dropdown-item pointer"
                                                onClick={() => handleDropdownNav('passwordchange?page=Password ändern')}
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
    );
}
