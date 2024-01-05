import { useDialog } from '../../contexts/dialogContext';
import { useJournal } from '../../contexts/journalContext';

export default function JournalTableExpansion() {
    const { expansionData } = useJournal();
    const { openDialog } = useDialog();

    return (
        <>
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
                        <td className="td-left">{expansionData.user}</td>
                        <td>
                            <div className="td-info">{expansionData.info}</div>
                        </td>
                        <td className="journal-table-edit td-right">
                            <img
                                src="/assets/icons/pencil-fill-black.svg"
                                alt="Bearbeiten"
                                className="journal-table-edit-icon iconClickable"
                                onClick={() => openDialog('journalEditRef')}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
