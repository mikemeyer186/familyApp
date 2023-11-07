import DialogEditData from './dialogEditData';

export default function JournalTableExpansion({ data, activeJournal }) {
    return (
        <>
            <DialogEditData data={data} activeJournal={activeJournal} />

            <table className="table journal-detail-table">
                <thead>
                    <tr>
                        <th scope="col" className="fw-normal" style={{ width: '113px' }}>
                            Von
                        </th>
                        <th scope="col" className="fw-normal" style={{ width: '315px' }}>
                            Beleginfo
                        </th>
                        <th scope="col" className="fw-normal" style={{ width: '15%' }}>
                            Bearbeiten
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.user}</td>
                        <td>{data.info}</td>
                        <td className="journal-table-edit">
                            <img
                                src="/assets/icons/pencil-fill-black.svg"
                                alt="Bearbeiten"
                                className="journal-table-edit-icon iconClickable"
                                data-bs-toggle="modal"
                                data-bs-target="#editJournalData"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
