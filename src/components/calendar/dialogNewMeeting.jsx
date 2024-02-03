import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useCalendar } from '../../contexts/calendarContext';
import { useDialog } from '../../contexts/dialogContext';

export default function DialogNewMeeting() {
    const { activeUser } = useUser();
    const { timeSlotClicked, selectedTimeSlot, addNewMeeting, setTimeSlotClicked } = useCalendar();
    const { dialogs, openDialog, closeDialog } = useDialog();
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
     * adds new meeting to calendar with data from form
     * @param {event} e - event from form submit
     */
    function handleNewMeeting(e) {
        e.preventDefault();
        const newMeeting = {
            title: title,
            start: combineDateAndTime(startDate, startTime).toISOString(),
            end: combineDateAndTime(endDate, endTime).toISOString(),
            allDay: checkAllDay(),
            data: {
                info: info,
                color: color,
                id: crypto.randomUUID(),
                user: activeUser.displayName,
                creation: new Date().toISOString(),
                public: false,
            },
        };
        addNewMeeting(newMeeting);
        handleCloseDialog();
        handleReset();
    }

    /**
     * closes new meeting dialog
     */
    function handleCloseDialog() {
        closeDialog('calendarNewRef');
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

    /**
     * resets form
     */
    function handleReset() {
        setTimeout(() => {
            setTitle('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setEndDate(new Date().toISOString().split('T')[0]);
            setStartTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setInfo('');
            setAllDayYes(false);
            setAllDayNo(true);
            setTimeSlotClicked(false);
        }, 300);
        handleCloseDialog();
    }

    /**
     * sets time and date from selected time slot when user clicks on time slot
     */
    const setTimeEventOnClick = useCallback(
        function setTimeEventOnClick() {
            setAllDayYes(false);
            setAllDayNo(true);
            setStartDate(selectedTimeSlot.start.toISOString().split('T')[0]);
            setEndDate(selectedTimeSlot.end.toISOString().split('T')[0]);
            setStartTime(selectedTimeSlot.start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(selectedTimeSlot.end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
        },
        [selectedTimeSlot]
    );

    /**
     * sets all day event when user clicks on all day event slot
     */
    const setAllDayEventOnClick = useCallback(
        function setAllDayEventOnClick() {
            setStartDate(selectedTimeSlot.end.toISOString().split('T')[0]);
            setEndDate(selectedTimeSlot.end.toISOString().split('T')[0]);
            setStartTime('01:00');
            setEndTime('01:00');
            setAllDayYes(true);
            setAllDayNo(false);
        },
        [selectedTimeSlot]
    );

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
     * opens modal if time slot is clicked
     */
    useEffect(() => {
        if (timeSlotClicked) {
            setTimeEventOnClick();
            if (selectedTimeSlot.start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) === '00:00') {
                setAllDayEventOnClick();
            }
            openDialog('calendarNewRef');
        }
    }, [selectedTimeSlot, timeSlotClicked, setAllDayEventOnClick, setTimeEventOnClick, openDialog]);

    return (
        <div ref={dialogs.calendarNewRef} className="modal fade" id="calendarNewRef" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neuen Termin eintragen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
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
                                                <label htmlFor="startTime" className="col-form-label">
                                                    Von
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="startTime"
                                                    value={startTime}
                                                    onChange={(e) => handleStartTimeChange(e.target.value)}
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
                                            {errorTime && <span className="error-date">Das Enddatum liegt vor dem Startdatum!</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-row mb-3">
                                <div className="widthFull">
                                    <label htmlFor="meetingInfo" className="col-form-label">
                                        Weitere Informationen
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="meetingInfo"
                                        placeholder="Zusätzliche Info zum Termin"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={title === '' || errorDate || errorTime}>
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
