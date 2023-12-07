import { Navigate as navigate } from 'react-big-calendar';

function ViewNamesGroup({ views: viewNames, view, onView }) {
    const viewImages = {
        week: '/assets/icons/calendar_week.svg',
        month: '/assets/icons/calendar_month.svg',
        agenda: '/assets/icons/calendar_agenda.svg',
    };

    return viewNames.map((name) => (
        <button type="button" key={name} className={view === name ? 'rbc-active' : ''} onClick={() => onView(name)}>
            <img src={viewImages[name]} alt="Calendar View" />
        </button>
    ));
}

export default function CalendarToolbar({ label, localizer: { messages }, onNavigate, onView, view, views }) {
    return (
        <div className="rbc-toolbar">
            <div className="rbc-toolbar-top">
                <span className="rbc-toolbar-label">{label}</span>
            </div>

            <div className="rbc-toolbar-bottom">
                <span className="rbc-btn-group">
                    <button type="button" onClick={() => onNavigate(navigate.PREVIOUS)} aria-label={messages.previous}>
                        <img src="/assets/icons/arrow_back.svg" alt="Back" />
                    </button>
                    <button type="button" onClick={() => onNavigate(navigate.TODAY)} aria-label={messages.today}>
                        <img src="/assets/icons/today.svg" alt="Back" />
                    </button>
                    <button type="button" onClick={() => onNavigate(navigate.NEXT)} aria-label={messages.next}>
                        <img src="/assets/icons/arrow_forward.svg" alt="Back" />
                    </button>
                </span>

                <span className="rbc-btn-group">
                    <ViewNamesGroup view={view} views={views} messages={messages} onView={onView} />
                </span>
            </div>
        </div>
    );
}
