import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import { useDialog } from '../../contexts/dialogContext';

export default function DialogEditMeeting() {
    const { selectedEvent, editMeeting, setSelectedEvent } = useCalendar();
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
    const [publicEvent, setPublicEvent] = useState(false);
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
                user: selectedEvent.data.user,
                creation: selectedEvent.data.creation,
                public: false,
            },
        };
        editMeeting(editedMeeting);
        handleCloseDialog();
    }

    /**
     * opens delete dialog
     */
    function handleDialogDelete() {
        handleCloseDialog();
        openDialog('calendarDeleteRef');
    }

    /**
     * closes edit dialog
     */
    function handleCloseDialog() {
        closeDialog('calendarEditRef');
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
            checkDate(date, endDate);

            if (allDayNo) {
                setEndDate(validatedDate.toISOString().split('T')[0]);
                checkDate(date, date);
            }
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
        checkTime(time, endTime);
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
            setStartTime(new Date(selectedEvent.start).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndTime(new Date(selectedEvent.end).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
            setEndDate(startDate);
        } else {
            setAllDayYes(true);
            setAllDayNo(false);
            setStartTime('02:00');
            setEndTime('23:59');
        }
    }

    /**
     * resets the edited meeting data on hiding the modal
     */
    const resetSelectedEvent = useCallback(
        function resetSelectedEvent() {
            setSelectedEvent(null);
            setErrorDate(false);
            setErrorTime(false);
        },
        [setSelectedEvent]
    );

    /**
     * sets form values to selected event values, if selected event is available
     * selectedEvent is changing when user clicks on an event in the calendar
     */
    useMemo(
        function updateDialog() {
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
                setPublicEvent(selectedEvent.data.public);
            }
        },
        [selectedEvent]
    );

    /**
     * listens to hidden modal event to reset the states
     */
    useEffect(() => {
        const editModal = dialogs.calendarEditRef.current;
        editModal.addEventListener('hidden.bs.modal', resetSelectedEvent);

        return () => {
            editModal.removeEventListener('hidden.bs.modal', resetSelectedEvent);
        };
    }, [dialogs.calendarEditRef, resetSelectedEvent]);

    return (
        <div className="modal fade" id="calendarEditRef" tabIndex="-1" aria-hidden="true" ref={dialogs.calendarEditRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Termin ändern</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <form onSubmit={handleEditMeeting}>
                        <div className="modal-body">
                            <div className="form-row mb-3">
                                <div className="width-full">
                                    <label htmlFor="editTitle" className="col-form-label">
                                        Termin
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editTitle"
                                        placeholder="Titel eingeben..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={publicEvent}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 space-between">
                                    <div className="width-half">
                                        <label htmlFor="editAllDayYes" className="col-form-label">
                                            Ganztägig
                                        </label>
                                        <div className="btn-group check-btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                name="btnradio"
                                                id="editAllDayYes"
                                                autoComplete="off"
                                                checked={allDayYes}
                                                onChange={handleAllDayChange}
                                                disabled={publicEvent}
                                            />
                                            <label className="btn btn-secondary checkbox-btn" htmlFor="editAllDayYes">
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
                                                disabled={publicEvent}
                                            />
                                            <label className="btn btn-secondary checkbox-btn" htmlFor="editAllDayNo">
                                                Nein
                                            </label>
                                        </div>
                                    </div>
                                    <div className="width-half">
                                        <label htmlFor="editColor" className="col-form-label">
                                            Farbe
                                        </label>
                                        <div className="color-picker">
                                            <input
                                                type="color"
                                                className="form-control"
                                                id="editColor"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                disabled={publicEvent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row mb-3">
                                <div className="input-group mb-3 space-between">
                                    <div className={allDayNo ? 'width-full' : 'width-half'}>
                                        <label htmlFor="editStartDate" className="col-form-label">
                                            {allDayNo ? 'Datum' : 'Startdatum'}
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="editStartDate"
                                            value={startDate}
                                            onChange={(e) => handleStartDateChange(e.target.value)}
                                            disabled={publicEvent}
                                        />
                                    </div>

                                    {allDayYes && (
                                        <div className="width-half">
                                            <label htmlFor="editEndDate" className="col-form-label">
                                                Enddatum
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="editEndDate"
                                                min={startDate}
                                                value={endDate}
                                                onChange={(e) => handleEndDateChange(e.target.value)}
                                                disabled={publicEvent}
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
                                                <label htmlFor="editStartTime" className="col-form-label">
                                                    Von
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="editStartTime"
                                                    value={startTime}
                                                    onChange={(e) => handleStartTimeChange(e.target.value)}
                                                    disabled={publicEvent}
                                                />
                                            </div>

                                            <div className="width-half">
                                                <label htmlFor="editEndTime" className="col-form-label">
                                                    Bis
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="editEndTime"
                                                    value={endTime}
                                                    onChange={(e) => handleEndTimeChange(e.target.value)}
                                                    disabled={publicEvent}
                                                />
                                            </div>
                                            {errorTime && <span className="error-date">Das Ende liegt vor dem Beginn!</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-row mb-3">
                                <div className="width-full">
                                    <label htmlFor="meetingEditInfo" className="col-form-label">
                                        Weitere Informationen
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="meetingEditInfo"
                                        placeholder="Zusätzliche Information"
                                        value={info}
                                        onChange={(e) => setInfo(e.target.value)}
                                        disabled={publicEvent}
                                    />
                                </div>
                            </div>
                        </div>
                        {!publicEvent && (
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleDialogDelete}>
                                    Löschen
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={title === '' || errorDate || errorTime}
                                    onClick={handleCloseDialog}
                                >
                                    Ändern
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
