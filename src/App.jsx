import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import ListPage from './components/list/listPage';
import Navbar from './components/main/navbar';

export default function App() {
    return (
        <>
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="listPage-container">
                <ListPage />
            </div>
        </>
    );
}
