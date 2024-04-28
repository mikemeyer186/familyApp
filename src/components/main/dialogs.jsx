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
import DialogInvitation from '../profile/dialogInvitation';
import DialogConnect from '../profile/dialogConnect';
import DialogCreate from '../profile/dialogCreate';

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
            <DialogInvitation />
            <DialogConnect />
            <DialogCreate />
        </>
    );
}
