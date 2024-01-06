import { Outlet } from 'react-router';
import Navbar from './navbar';
import Dialogs from './dialogs';

export default function AppLayout() {
    return (
        <>
            <Dialogs />
            <Navbar />
            <Outlet />
        </>
    );
}
