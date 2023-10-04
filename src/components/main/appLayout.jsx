import { Outlet } from 'react-router';
import Navbar from './navbar';

export default function AppLayout({ signOutUser, activeUser }) {
    return (
        <>
            <Navbar signOutUser={signOutUser} activeUser={activeUser} />
            <Outlet />
        </>
    );
}
