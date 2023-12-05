import DialogEditData from './dialogEditData';

export default function JournalTableExpansion({ data, setExpandedRows }) {
    return (
        <>
            <DialogEditData data={data} setExpandedRows={setExpandedRows} />

            <table className="table journal-detail-table">
                <thead>
                    <tr>
                        <th scope="col" className="fw-normal th-left" style={{ width: '113px' }}>
                            Von
                        </th>
                        <th scope="col" className="fw-normal" style={{ width: '315px' }}>
                            Beleginfo
                        </th>
                        <th scope="col" className="fw-normal th-right" style={{ width: '15%' }}>
                            Bearbeiten
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="td-left">{data.user}</td>
                        <td>{data.info}</td>
                        <td className="journal-table-edit td-right">
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
