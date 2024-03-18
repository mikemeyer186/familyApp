import { useUser } from '../../contexts/userContext';
import MotivationTile from './motivationTile';
import EventsTile from './eventsTile';
import ListsTile from './listsTile';
import JournalTile from './journalTile';
import AssistantTile from './assistantTile';

export default function DashboardContent({ todayEvents, importantItems, numberOfItems, journalBalances }) {
    const { activeUser, greeting } = useUser();

    return (
        <div className="fade-effect">
            <div className="dashboard-top">
                <h5 className="title">
                    <span className="title-greeting">{activeUser.displayName ? greeting + ',' : greeting}</span>
                    <span className="title-name">{activeUser.displayName && activeUser.displayName + '!'}</span>{' '}
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
        </div>
    );
}
