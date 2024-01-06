import { Outlet } from 'react-router';
import Navbar from './navbar';
import DialogDeleteMeeting from '../calendar/dialogDeleteMeeting';
import DialogNewMeeting from '../calendar/dialogNewMeeting';
import DialogEditMeeting from '../calendar/dialogEditMeeting';
import DialogNewData from '../journal/dialogNewData';
import DialogEditData from '../journal/dialogEditData';
import DialogNewList from '../list/dialogNewList';
import DialogEditList from '../list/dialogEditList';

export default function AppLayout() {
    return (
        <>
            <DialogNewMeeting />
            <DialogEditMeeting />
            <DialogDeleteMeeting />
            <DialogNewData />
            <DialogEditData />
            <DialogNewList />
            <DialogEditList />
            <Navbar />
            <Outlet />
        </>
    );
}
