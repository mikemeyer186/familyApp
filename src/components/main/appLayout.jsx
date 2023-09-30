import { Outlet } from 'react-router';
import Navbar from './navbar';

export default function AppLayout({ signOutUser, setOpenPage, activeUser }) {
    return (
        <>
            <Navbar signOutUser={signOutUser} setOpenPage={setOpenPage} activeUser={activeUser} />
            <Outlet />
        </>
    );
}
