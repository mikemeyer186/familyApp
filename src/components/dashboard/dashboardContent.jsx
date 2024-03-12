import { useUser } from '../../contexts/userContext';
import MotivationTile from './motivationTile';
import EventsTile from './eventsTile';
import ListsTile from './listsTile';
import JournalTile from './journalTile';
import AssistantTile from './assistantTile';

export default function DashboardContent({ todayEvents, importantItems, numberOfItems, journalBalances }) {
    const { activeUser, greeting } = useUser();

    return (
        <>
            <div className="mb-5">
                <h5 className="title">
                    {greeting}
                    {activeUser.displayName ? ', ' + activeUser.displayName + '!' : ''}
                </h5>
                <MotivationTile />
            </div>
            <h5 className="title">Dashboard</h5>
            <div className="tile-wrapper">
                <div className="dashboard-row">
                    <EventsTile todayEvents={todayEvents} />
                    <ListsTile importantItems={importantItems} numberOfItems={numberOfItems} />
                </div>
                <div className="dashboard-row">
                    <JournalTile journalBalances={journalBalances} />
                    <AssistantTile />
                </div>
            </div>
        </>
    );
}