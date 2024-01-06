import DialogDeleteMeeting from '../calendar/dialogDeleteMeeting';
import DialogNewMeeting from '../calendar/dialogNewMeeting';
import DialogEditMeeting from '../calendar/dialogEditMeeting';
import DialogNewData from '../journal/dialogNewData';
import DialogEditData from '../journal/dialogEditData';
import DialogDeleteData from '../journal/dialogDeleteData';
import DialogNewList from '../list/dialogNewList';
import DialogEditList from '../list/dialogEditList';
import DialogDeleteList from '../list/dialogDeleteList';

export default function Dialogs() {
    return (
        <>
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
