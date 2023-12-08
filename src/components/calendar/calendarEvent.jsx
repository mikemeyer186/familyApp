export default function CalendarEvent({ event }) {
    const color = event.data.color;
    return (
        <div
            className="rbc-event"
            style={{
                background: color,
                border: `1px solid ${color}`,
                height: '100%',
                width: '100%',
                padding: '2px',
            }}
        >
            <div className="rbc-event-content">{event.title}</div>
        </div>
    );
}
