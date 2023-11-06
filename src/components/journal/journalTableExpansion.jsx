export default function JournalTableExpansion({ data }) {
    return (
        <>
            <table className="table journalDetailTable">
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
                        <td>x x</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
