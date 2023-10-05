import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

export default function DialogNewData() {
    const [amount, setAmount] = useState('');
    // const [flow, setFlow] = useState('');
    // const [category, setCategory] = useState('');
    // const [year, setYear] = useState(2023);
    // const [month, setMonth] = useState(1);
    const [info, setInfo] = useState('');

    function handleAddNewData(e) {
        e.preventDefault();
        console.log(typeof amount, amount);
        setAmount('');
    }

    function handleAbort() {
        setAmount('');
        setInfo('');
    }

    return (
        <div className="modal fade" id="newJournalData" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neuen Beleg eingeben</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAddNewData}>
                            <div className="mb-3">
                                <label htmlFor="amount" className="col-form-label">
                                    Betrag*
                                </label>
                                <CurrencyInput
                                    id="amount"
                                    className="form-control"
                                    placeholder="0,00 €"
                                    decimalScale={2}
                                    intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
                                    allowNegativeValue={false}
                                    value={amount}
                                    onValueChange={(value) => setAmount(value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="info" className="col-form-label">
                                    Kommentar
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="info"
                                    placeholder="Zusätzliche Info zum Beleg"
                                    value={info}
                                    onChange={(e) => setInfo(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleAbort}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Buchen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
