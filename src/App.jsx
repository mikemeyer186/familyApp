import './styles/global.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ListPage from './components/list/listPage';
import Navbar from './components/main/navbar';

export default function App() {
    return (
        <>
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="listPage-container">
                <div className="listPage-wrapper">
                    <ListPage />
                </div>
            </div>
        </>
    );
}
