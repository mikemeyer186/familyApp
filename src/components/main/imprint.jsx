import { NavLink } from 'react-router-dom';

export default function Imprint() {
    return (
        <div className="scroll-container">
            <div className="imprint-container">
                <NavLink to="/">
                    <button type="button" className="btn-close iconClickable close-icon" aria-label="Close"></button>
                </NavLink>

                <img className="logo" src="/assets/img/logo_blue.png" alt="Logo Family App" />

                <div>
                    <h1>Impressum</h1>

                    <h3>Angaben gemäß § 5 TMG</h3>

                    <div>
                        <p>
                            Mike Meyer
                            <br />
                            Claustorwall 9c
                            <br />
                            38640 Goslar
                            <br />
                            <br />
                        </p>
                    </div>

                    <h3>Kontakt</h3>
                    <p>
                        Telefon: +49 (0) 151 255 267 04
                        <br />
                        E-Mail:{' '}
                        <a className="mail-link" href="mailto:contact@mike-meyer.dev?subject=Family App">
                            contact@mike-meyer.dev
                        </a>
                    </p>

                    <p>
                        Quelle: <a href="https://www.e-recht24.de">eRecht24</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
