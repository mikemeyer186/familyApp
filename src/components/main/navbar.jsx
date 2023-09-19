import { useEffect, useState } from 'react';

export default function Navbar({ signOutUser, setOpenPage, activeUser }) {
    const [greeting, setGreeting] = useState('Hallo, ');

    function handleSignOut() {
        signOutUser();
    }

    function checkDaytime() {
        let daytime = new Date();
        let hours = daytime.getHours();
        if (hours >= 6 && hours < 11) {
            setGreeting('Guten Morgen, ');
        } else if (hours >= 11 && hours < 17) {
            setGreeting('Guten Tag, ');
        } else if (hours >= 17 && hours <= 23) {
            setGreeting('Guten Abend, ');
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
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                                {greeting}
                                {activeUser.displayName + '!'}
                            </h5>
                            <button type="button" className="btn-close iconClickable" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <img src="/assets/icons/clipboard-data.svg" alt="Dashboard" />
                                    <a className="nav-link active" aria-current="page" href="#">
                                        Dashboard
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <img src="/assets/icons/card-checklist.svg" alt="Listen" />
                                    <a className="nav-link" href="#">
                                        Listen
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <img src="/assets/icons/cash-coin.svg" alt="Journal" />
                                    <a className="nav-link" href="#">
                                        Journal
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <img src="/assets/icons/calendar3.svg" alt="Kalender" />
                                    <a className="nav-link" href="#">
                                        Kalender
                                    </a>
                                </li>
                                <li className="nav-item dropdown">
                                    <img src="/assets/icons/person-gear.svg" alt="Profil" />
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Benutzerprofil
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a
                                                className="dropdown-item pointer"
                                                data-bs-dismiss="offcanvas"
                                                href="#"
                                                onClick={() => setOpenPage('UserProfile')}
                                            >
                                                Profil bearbeiten
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                Passwort ändern
                                            </a>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                Problem melden
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <img src="/assets/icons/door-open.svg" alt="Logout" />
                                    <span className="nav-link pointer" aria-current="page" onClick={handleSignOut}>
                                        Abmelden
                                    </span>
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
