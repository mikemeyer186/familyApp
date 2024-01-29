export default function EventsTile({ nextEvents, navigateToPage }) {
    return (
        <div className="dashboard-tile" onClick={() => navigateToPage('/app/calendar?page=Kalender')}>
            <h4 className="tile-title">Nächste Termine</h4>
            {nextEvents.length > 0 ? (
                nextEvents.map((event) => {
                    return (
                        <div className="tile-event" key={event.data.id}>
                            <div className="event-left">
                                <span>
                                    {event.start.toLocaleString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </span>

                                <div className="event-left-time">
                                    {!event.allDay ? (
                                        <>
                                            <span>
                                                {event.start.toLocaleTimeString('de-DE', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            <span> - </span>
                                            <span>
                                                {event.end.toLocaleTimeString('de-DE', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {event.start === event.end ? (
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
                            <div className="event-right">
                                <span>{event.title}</span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <span className="tile-empty-text">In den nächsten 7 Tagen stehen keine Termine an</span>
            )}
        </div>
    );
}
