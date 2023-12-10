import { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useCalendar } from '../../contexts/calendarContext';

export default function DialogNewMeeting() {
    const { activeUser } = useUser();
    const { setEvents } = useCalendar();
    const [title, setTitle] = useState('');
    const [info, setInfo] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [endTime, setEndTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    const [allDayYes, setAllDayYes] = useState(false);
    const [allDayNo, setAllDayNo] = useState(true);
    const [color, setColor] = useState('#6584e2');

    function handleNewMeeting(e) {
        e.preventDefault();
        const newMeeting = {
            title: title,
            start: combineDateAndTime(startDate, startTime),
            end: combineDateAndTime(endDate, endTime),
            allDay: checkAllDay(),
            data: {
                info: info,
                color: color,
                id: crypto.randomUUID(),
                user: activeUser.displayName,
                creation: new Date().toISOString(),
            },
        };
        //ceck if end date is before start date
        //cekc if end time is before start time
        console.log(newMeeting);
        setEvents((currentEvents) => {
            const events = [...currentEvents, newMeeting];
            return events;
        });
    }

    function combineDateAndTime(date, time) {
        let combinedDate = new Date(date);
        let timeSplit = time.split(':');
        combinedDate.setHours(timeSplit[0]);
        combinedDate.setMinutes(timeSplit[1]);

        return combinedDate;
    }

    function checkAllDay() {
        if (allDayYes) {
            return true;
        } else {
            return false;
        }
    }

    function handleStartDateChange(date) {
        if (allDayNo) {
            setStartDate(new Date(date).toISOString().split('T')[0]);
            setEndDate(new Date(date).toISOString().split('T')[0]);
        } else {
            setStartDate(new Date(date).toISOString().split('T')[0]);
        }
    }

    function handleAllDayChange() {
        if (allDayYes) {
            setAllDayYes(false);
            setAllDayNo(true);
            setStartTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndDate(startDate);
        } else {
            setAllDayYes(true);
            setAllDayNo(false);
            setStartTime('01:00');
            setEndTime('01:00');
        }
    }

    function handleAbort() {
        setTitle('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setStartTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
        setEndTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
        setInfo('');
    }

    return (
        <div className="modal fade" id="newMeetingModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neuen Termin eintragen</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleNewMeeting}>
                            <div className="form-row mb-3">
                                <div className="widthFull">
                                    <label htmlFor="title" className="col-form-label">
                                        Termin
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        placeholder="Name des Termins"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 spaceBetween">
                                    <div className="widthHalf">
                                        <label htmlFor="allDayYes" className="col-form-label">
                                            Ganztägig
                                        </label>
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                name="btnradio"
                                                id="allDayYes"
                                                autoComplete="off"
                                                checked={allDayYes}
                                                onChange={handleAllDayChange}
                                            />
                                            <label className="btn btn-outline-secondary checkbox-btn" htmlFor="allDayYes">
                                                Ja
                                            </label>

                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="allDayNo"
                                                autoComplete="off"
                                                checked={allDayNo}
                                                onChange={handleAllDayChange}
                                            />
                                            <label className="btn btn-outline-secondary checkbox-btn" htmlFor="allDayNo">
                                                Nein
                                            </label>
                                        </div>
                                    </div>
                                    <div className="widthHalf">
                                        <label htmlFor="color" className="col-form-label">
                                            Farbe
                                        </label>
                                        <input
                                            type="color"
                                            className="form-control color-picker"
                                            id="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 spaceBetween">
                                    <div className={allDayNo ? 'widthFull' : 'widthHalf'}>
                                        <label htmlFor="startDate" className="col-form-label">
                                            {allDayNo ? 'Datum' : 'Startdatum'}
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="startDate"
                                            value={startDate}
                                            onChange={(e) => handleStartDateChange(e.target.value)}
                                        />
                                    </div>

                                    {allDayYes && (
                                        <div className="widthHalf">
                                            <label htmlFor="endDate" className="col-form-label">
                                                Enddatum
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="endDate"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {allDayNo && (
                                <>
                                    <div className="form-row mb-3">
                                        <div className="input-group mb-3 spaceBetween">
                                            <div className="widthHalf">
                                                <label htmlFor="startTime" className="col-form-label">
                                                    Von
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="startTime"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                />
                                            </div>

                                            <div className="widthHalf">
                                                <label htmlFor="endTime" className="col-form-label">
                                                    Bis
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="endTime"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-row mb-3">
                                <div className="widthFull">
                                    <label htmlFor="info" className="col-form-label">
                                        Weitere Informationen
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="info"
                                        placeholder="Zusätzliche Info zum Termin"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleAbort}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={title === ''}>
                                    Eintragen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
