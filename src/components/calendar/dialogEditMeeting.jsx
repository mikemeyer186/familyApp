import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useCalendar } from '../../contexts/calendarContext';

export default function DialogEditMeeting() {
    const { activeUser } = useUser();
    const { selectedEvent, editMeeting, deleteMeeting } = useCalendar();
    const [title, setTitle] = useState('');
    const [info, setInfo] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [endTime, setEndTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    const [allDayYes, setAllDayYes] = useState(false);
    const [allDayNo, setAllDayNo] = useState(true);
    const [color, setColor] = useState('#6584e2');
    const [errorDate, setErrorDate] = useState(false);
    const [errorTime, setErrorTime] = useState(false);

    /**
     * edit meeting in calendar with data from form
     * @param {event} e - event from form submit
     */
    function handleEditMeeting(e) {
        e.preventDefault();
        const editedMeeting = {
            title: title,
            start: combineDateAndTime(startDate, startTime).toISOString(),
            end: combineDateAndTime(endDate, endTime).toISOString(),
            allDay: checkAllDay(),
            data: {
                info: info,
                color: color,
                id: selectedEvent.data.id,
                user: activeUser.displayName,
                creation: new Date().toISOString(),
            },
        };
        editMeeting(editedMeeting);
    }

    /**
     * deletes meeting from calendar
     */
    function handleDeleteMeeting() {
        deleteMeeting(selectedEvent.data.id);
    }

    /**
     * checks if end date is before start date
     */
    const checkDate = useCallback(
        function checkDate() {
            if (endDate < startDate) {
                setErrorDate(true);
            } else {
                setErrorDate(false);
            }
        },
        [endDate, startDate]
    );

    /**
     * checks if end time is before start time
     */
    const checkTime = useCallback(
        function checkTime() {
            if (endTime < startTime) {
                setErrorTime(true);
            } else {
                setErrorTime(false);
            }
        },
        [endTime, startTime]
    );

    /**
     * combines date and time to one date for calendar
     * @param {date} date - date from datepicker
     * @param {date} time - time from timepicker
     * @returns
     */
    function combineDateAndTime(date, time) {
        let combinedDate = new Date(date);
        let timeSplit = time.split(':');
        combinedDate.setHours(timeSplit[0]);
        combinedDate.setMinutes(timeSplit[1]);

        return combinedDate;
    }

    /**
     * checks if all day is checked
     * @returns true if all day is checked, false if not
     */
    function checkAllDay() {
        if (allDayYes) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets end date and start date
     * @param {date} date
     */
    function handleStartDateChange(date) {
        setStartDate(new Date(date).toISOString().split('T')[0]);
        setEndDate(new Date(date).toISOString().split('T')[0]);
    }

    /**
     * sets end time and start time
     * @param {date} time - time from timepicker
     */
    function handleStartTimeChange(time) {
        setStartTime(time);
        setEndTime(time);
    }

    /**
     * handles all day change
     * sets start time, end time and end date to default values
     */
    function handleAllDayChange() {
        if (allDayYes) {
            setAllDayYes(false);
            setAllDayNo(true);
            setStartTime(new Date(selectedEvent.start).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(new Date(selectedEvent.end).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndDate(startDate);
        } else {
            setAllDayYes(true);
            setAllDayNo(false);
            setStartTime('01:00');
            setEndTime('01:00');
        }
    }

    /**
     * checks if end date is before start date on change
     */
    useEffect(() => {
        checkDate();
    }, [startDate, endDate, checkDate]);

    /**
     * checks if end time is before start time on change
     */
    useEffect(() => {
        checkTime();
    }, [startTime, endTime, checkTime]);

    /**
     * sets form values to selected event values if selected event is available
     * selectedEvent is changing when user clicks on an event in the calendar
     */
    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);
            setStartDate(new Date(selectedEvent.start).toISOString().split('T')[0]);
            setEndDate(new Date(selectedEvent.end).toISOString().split('T')[0]);
            setStartTime(new Date(selectedEvent.start).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(new Date(selectedEvent.end).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setAllDayYes(selectedEvent.allDay);
            setAllDayNo(!selectedEvent.allDay);
            setInfo(selectedEvent.data.info);
            setColor(selectedEvent.data.color);
        }
    }, [selectedEvent]);

    return (
        <div className="modal fade" id="editMeetingModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Termin ändern</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleEditMeeting}>
                            <div className="form-row mb-3">
                                <div className="widthFull">
                                    <label htmlFor="editTitle" className="col-form-label">
                                        Termin
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editTitle"
                                        placeholder="Name des Termins"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 spaceBetween">
                                    <div className="widthHalf">
                                        <label htmlFor="editAllDayYes" className="col-form-label">
                                            Ganztägig
                                        </label>
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                name="btnradio"
                                                id="editAllDayYes"
                                                autoComplete="off"
                                                checked={allDayYes}
                                                onChange={handleAllDayChange}
                                            />
                                            <label className="btn btn-outline-secondary checkbox-btn" htmlFor="editAllDayYes">
                                                Ja
                                            </label>

                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="btnradio"
                                                id="editAllDayNo"
                                                autoComplete="off"
                                                checked={allDayNo}
                                                onChange={handleAllDayChange}
                                            />
                                            <label className="btn btn-outline-secondary checkbox-btn" htmlFor="editAllDayNo">
                                                Nein
                                            </label>
                                        </div>
                                    </div>
                                    <div className="widthHalf">
                                        <label htmlFor="editColor" className="col-form-label">
                                            Farbe
                                        </label>
                                        <input
                                            type="color"
                                            className="form-control color-picker"
                                            id="editColor"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 spaceBetween">
                                    <div className={allDayNo ? 'widthFull' : 'widthHalf'}>
                                        <label htmlFor="editStartDate" className="col-form-label">
                                            {allDayNo ? 'Datum' : 'Startdatum'}
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="editStartDate"
                                            value={startDate}
                                            onChange={(e) => handleStartDateChange(e.target.value)}
                                        />
                                    </div>

                                    {allDayYes && (
                                        <div className="widthHalf">
                                            <label htmlFor="editEndDate" className="col-form-label">
                                                Enddatum
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="editEndDate"
                                                min={startDate}
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {errorDate && <span className="error-date">Das Enddatum liegt vor dem Startdatum!</span>}
                                </div>
                            </div>

                            {allDayNo && (
                                <>
                                    <div className="form-row mb-3">
                                        <div className="input-group mb-3 spaceBetween">
                                            <div className="widthHalf">
                                                <label htmlFor="editStartTime" className="col-form-label">
                                                    Von
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="editStartTime"
                                                    value={startTime}
                                                    onChange={(e) => handleStartTimeChange(e.target.value)}
                                                />
                                            </div>

                                            <div className="widthHalf">
                                                <label htmlFor="editEndTime" className="col-form-label">
                                                    Bis
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="editEndTime"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                />
                                            </div>
                                            {errorTime && <span className="error-date">Das Enddatum liegt vor dem Startdatum!</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-row mb-3">
                                <div className="widthFull">
                                    <label htmlFor="editInfo" className="col-form-label">
                                        Weitere Informationen
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editInfo"
                                        placeholder="Zusätzliche Info zum Termin"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteMeeting}>
                                    Löschen
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    disabled={title === '' || errorDate || errorTime || info === 'OpenHolidays API'}
                                >
                                    Ändern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
