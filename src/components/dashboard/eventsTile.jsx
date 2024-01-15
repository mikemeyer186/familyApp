export default function EventsTile({ nextEvents }) {
    return (
        <div className="dashboard-tile">
            <h4 className="tile-title">Nächste Termine</h4>
            {nextEvents.map((event) => {
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
                                    <span>ganztägig</span>
                                )}
                            </div>
                        </div>
                        <div className="event-right">
                            <span>{event.title}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
