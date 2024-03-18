import { useCallback, useMemo, useState } from 'react';
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
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
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
        setTimeSlotClicked(false);
        closeDialog('calendarNewRef');
    }

    /**
     * checks if end date is before start date
     */
    function checkDate(startDateInput, endDateInput) {
        if (endDateInput < startDateInput) {
            setErrorDate(true);
        } else {
            setErrorDate(false);
        }
    }

    /**
     * checks if end time is before start time
     */
    function checkTime(startTimeInput, endTimeInput) {
        if (endTimeInput < startTimeInput) {
            setErrorTime(true);
        } else {
            setErrorTime(false);
        }
    }

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
     * validates the date
     * @param {date} dateInput - from input (YYYY-MM-DD)
     * @returns
     */
    function validateDateInput(dateInput) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (dateInput.match(regex) === null) {
            return false;
        } else {
            const date = new Date(dateInput);
            return date;
        }
    }

    /**
     * sets start date and same value as end date (avoids date error)
     * validates and checks date in case of user types manually
     * @param {date} date
     */
    function handleStartDateChange(date) {
        const validatedDate = validateDateInput(date);

        if (validatedDate) {
            setStartDate(validatedDate.toISOString().split('T')[0]);
            setEndDate(validatedDate.toISOString().split('T')[0]);
            checkDate(date, date);
        } else {
            return;
        }
    }

    /**
     * sets end date
     * validates and checks date in case of user types manually
     * @param {date} date
     */
    function handleEndDateChange(date) {
        const validatedDate = validateDateInput(date);

        if (validatedDate) {
            setEndDate(validatedDate.toISOString().split('T')[0]);
            checkDate(startDate, date);
        } else {
            return;
        }
    }

    /**
     * sets start time and same value as end time (avoids time error)
     * checks time in case of user types manually
     * @param {date} time - time from timepicker
     */
    function handleStartTimeChange(time) {
        setStartTime(time);
        setEndTime(time);
        checkTime(time, time);
    }

    /**
     * sets end time
     * checks time in case of user types manually
     * @param {date} time - time from timepicker
     */
    function handleEndTimeChange(time) {
        setEndTime(time);
        checkTime(startTime, time);
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
            setEndTime('23:59');
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
            setEndTime('23:59');
            setAllDayYes(true);
            setAllDayNo(false);
        },
        [selectedTimeSlot]
    );

    /**
     * opens modal if time slot is clicked
     * sets date and time data from calendar view (time or allday)
     */
    const openModalOnClick = useCallback(
        function openModalOnClick() {
            setTimeEventOnClick();

            if (selectedTimeSlot.start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) === '00:00') {
                setAllDayEventOnClick();
            }

            openDialog('calendarNewRef');
        },
        [openDialog, selectedTimeSlot, setAllDayEventOnClick, setTimeEventOnClick]
    );

    /**
     * opens the modal, if timeslot is clicked
     * sets timeslot clicked to flase after 1 sec to prevent opening after hide event
     */
    useMemo(() => {
        if (timeSlotClicked) {
            openModalOnClick();

            setTimeout(() => {
                setTimeSlotClicked(false);
            }, 1000);
        }
    }, [timeSlotClicked, openModalOnClick, setTimeSlotClicked]);

    return (
        <div ref={dialogs.calendarNewRef} className="modal fade" id="calendarNewRef" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neuer Termin</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <form onSubmit={handleNewMeeting}>
                        <div className="modal-body">
                            <div className="form-row mb-3">
                                <div className="width-full">
                                    <label htmlFor="title" className="col-form-label">
                                        Termin
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        placeholder="Titel des Termins"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 space-between">
                                    <div className="width-half">
                                        <label htmlFor="allDayYes" className="col-form-label">
                                            Ganztägig
                                        </label>
                                        <div className="btn-group check-btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                name="btnradio"
                                                id="allDayYes"
                                                autoComplete="off"
                                                checked={allDayYes}
                                                onChange={handleAllDayChange}
                                            />
                                            <label className="btn btn-secondary checkbox-btn" htmlFor="allDayYes">
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
                                            <label className="btn btn-secondary checkbox-btn" htmlFor="allDayNo">
                                                Nein
                                            </label>
                                        </div>
                                    </div>
                                    <div className="width-half">
                                        <label htmlFor="color" className="col-form-label">
                                            Farbe
                                        </label>
                                        <div className="color-picker">
                                            <input
                                                type="color"
                                                className="form-control"
                                                id="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 space-between">
                                    <div className={allDayNo ? 'width-full' : 'width-half'}>
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
                                        <div className="width-half">
                                            <label htmlFor="endDate" className="col-form-label">
                                                Enddatum
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="endDate"
                                                min={startDate}
                                                value={endDate}
                                                onChange={(e) => handleEndDateChange(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {errorDate && <span className="error-date">Das Enddatum liegt vor dem Startdatum!</span>}
                                </div>
                            </div>

                            {allDayNo && (
                                <>
                                    <div className="form-row mb-3">
                                        <div className="input-group mb-3 space-between">
                                            <div className="width-half">
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

                                            <div className="width-half">
                                                <label htmlFor="endTime" className="col-form-label">
                                                    Bis
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="endTime"
                                                    value={endTime}
                                                    onChange={(e) => handleEndTimeChange(e.target.value)}
                                                />
                                            </div>
                                            {errorTime && <span className="error-date">Das Ende liegt vor dem Beginn!</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-row mb-3">
                                <div className="width-full">
                                    <label htmlFor="meetingInfo" className="col-form-label">
                                        Weitere Informationen
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="meetingInfo"
                                        placeholder="Zusätzliche Information"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                    />
                                </div>
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
    );
}
