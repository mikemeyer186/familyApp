export default function JournalTable({ activeJournal }) {
    return (
        <div className="journal-payments">
            {activeJournal ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th className="table-date-header" scope="col">
                                Datum
                            </th>
                            <th className="table-category" scope="col">
                                Kategorie
                            </th>
                            <th className="table-payment-header" scope="col">
                                Betrag
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {activeJournal.payment.map((payment) => (
                            <tr key={payment.date}>
                                <td className="table-date-row">
                                    {new Date(payment.date).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="table-category">{payment.category}</td>
                                <td className={`table-payment-row ${payment.flow === 'Ausgabe' ? 'spend' : 'income'}`}>
                                    {payment.flow === 'Ausgabe'
                                        ? '- ' + payment.amount.toFixed(2).replace('.', ',')
                                        : '+ ' + payment.amount.toFixed(2).replace('.', ',')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="journal-payment__date">Noch keine Daten vorhanden</div>
            )}
        </div>
    );
}
