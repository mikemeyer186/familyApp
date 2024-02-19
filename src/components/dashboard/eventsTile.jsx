export default function EventsTile({ todayEvents, navigateToPage }) {
    const date = new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <div className="dashboard-tile tile-small" onClick={() => navigateToPage('/app/calendar?page=Kalender')}>
                <h6>Kalender</h6>
                <img src="/assets/img/calendar.webp" alt="Kalender" />
                <div className="tile-small-content">
                    <span className="small-content-header">{date}</span>
                    {todayEvents.length > 0 ? (
                        todayEvents.map((event, index) => {
                            if (index < 2) {
                                return (
                                    <div className="tile-event small-content-event" key={event.data.id}>
                                        <div className="event-left">
                                            <div className="event-left-time">
                                                {!event.allDay ? (
                                                    <>
                                                        <span>
                                                            {event.start.toLocaleTimeString('de-DE', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            }) + ' Uhr'}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        {new Date(event.start).getDate() === new Date(event.end).getDate() ? (
                                                            <span>ganztägig</span>
                                                        ) : (
                                                            <span>
                                                                <span>bis </span>
                                                                {event.end.toLocaleString('de-DE', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                })}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="small-content-event-title">{event.title}</span>
                                        </div>
                                    </div>
                                );
                            }
                            if (index === 2) {
                                return (
                                    <div className="tile-event small-content-event" key={event.data.id}>
                                        <span className="tile-more-events-text">
                                            {todayEvents.length === 3 ? '+ 1 weiterer Termin' : `+ ${todayEvents.length - 2} weitere Termine`}
                                        </span>
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <p className="tile-empty-text">Heute stehen keine Termine an</p>
                    )}
                </div>
            </div>
        </>
    );
}
