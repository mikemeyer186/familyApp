import { Outlet } from 'react-router';
import Navbar from './navbar';
import DialogDeleteMeeting from '../calendar/dialogDeleteMeeting';
import DialogNewMeeting from '../calendar/dialogNewMeeting';
import DialogEditMeeting from '../calendar/dialogEditMeeting';
import DialogNewData from '../journal/dialogNewData';

export default function AppLayout() {
    return (
        <>
            <DialogNewMeeting />
            <DialogEditMeeting />
            <DialogDeleteMeeting />
            <DialogNewData />
            <Navbar />
            <Outlet />
        </>
    );
}
