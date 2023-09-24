import { useEffect, useState } from 'react';

export default function Navbar({ signOutUser, setOpenPage, activeUser, openPage }) {
    const [greeting, setGreeting] = useState('Hallo, ');

    function handleSignOut() {
        signOutUser();
    }

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

    useEffect(() => {
        checkDaytime();
    }, []);

    return (
        <>
            <nav className="navbar fixed-top navbarBg">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        familyApp
                    </a>
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
                                    src={activeUser.photoURL ? activeUser.photoURL : 'assets/img/profile-picture.png'}
                                    className="offcanvas-image"
                                    alt="User image"
                                />
                                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                                    {greeting}
                                    {activeUser.displayName ? ', ' + activeUser.displayName + '!' : ''}
                                </h5>
                            </div>
                            <button type="button" className="btn-close iconClickable" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li
                                    className={`nav-item ${openPage === 'Dashboard' && 'active'}`}
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setOpenPage('Dashboard')}
                                >
                                    <img src="assets/icons/clipboard-data.svg" alt="Dashboard" />
                                    <span className="nav-link">Dashboard</span>
                                </li>
                                <li
                                    className={`nav-item ${openPage === 'ListPage' && 'active'}`}
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setOpenPage('ListPage')}
                                >
                                    <img src="assets/icons/card-checklist.svg" alt="Listen" />
                                    <span className="nav-link">Listen</span>
                                </li>
                                <li
                                    className={`nav-item ${openPage === 'Journal' && 'active'}`}
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setOpenPage('Journal')}
                                >
                                    <img src="assets/icons/cash-coin.svg" alt="Journal" />
                                    <span className="nav-link">Journal</span>
                                </li>
                                <li
                                    className={`nav-item ${openPage === 'Calendar' && 'active'}`}
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setOpenPage('Calendar')}
                                >
                                    <img src="assets/icons/calendar3.svg" alt="Kalender" />
                                    <span className="nav-link">Kalender</span>
                                </li>
                                <li>
                                    <hr className="nav-divider" />
                                </li>
                                <li className="nav-item dropdown" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                                    <img src="assets/icons/person-gear.svg" alt="Profil" />
                                    <span className="nav-link dropdown-toggle">Benutzerprofil</span>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <span
                                                className="dropdown-item pointer"
                                                data-bs-dismiss="offcanvas"
                                                onClick={() => setOpenPage('UserProfile')}
                                            >
                                                Profil bearbeiten
                                            </span>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                E-Mail Adresse ändern
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                Passwort ändern
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item" onClick={handleSignOut}>
                                    <img src="assets/icons/door-open.svg" alt="Logout" />
                                    <span className="nav-link pointer">Abmelden</span>
                                </li>
                            </ul>

                            <form className="d-flex mt-3" role="search">
                                <input className="form-control me-2" type="search" placeholder="Suchen..." aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">
                                    Suchen
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
