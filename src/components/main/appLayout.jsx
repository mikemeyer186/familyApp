import { Outlet } from 'react-router';
import Navbar from './navbar';

export default function AppLayout({ signOutUser }) {
    return (
        <>
            <Navbar signOutUser={signOutUser} />
            <Outlet />
        </>
    );
}
