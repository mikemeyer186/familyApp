import DialogDeleteMeeting from '../calendar/dialogDeleteMeeting';
import DialogNewMeeting from '../calendar/dialogNewMeeting';
import DialogEditMeeting from '../calendar/dialogEditMeeting';
import DialogNewData from '../journal/dialogNewData';
import DialogEditData from '../journal/dialogEditData';
import DialogDeleteData from '../journal/dialogDeleteData';
import DialogNewList from '../list/dialogNewList';
import DialogEditList from '../list/dialogEditList';
import DialogDeleteList from '../list/dialogDeleteList';
import DialogTestApp from '../dashboard/dialogTestApp';
import DialogPWAInstall from './dialogPWAInstall';

export default function Dialogs() {
    return (
        <>
            <DialogTestApp />
            <DialogPWAInstall />
            <DialogNewMeeting />
            <DialogEditMeeting />
            <DialogDeleteMeeting />
            <DialogNewData />
            <DialogEditData />
            <DialogDeleteData />
            <DialogNewList />
            <DialogEditList />
            <DialogDeleteList />
        </>
    );
}
