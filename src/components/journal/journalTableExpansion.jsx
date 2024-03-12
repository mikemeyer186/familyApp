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
                        <th scope="col" className="fw-normal th-left">
                            Von
                        </th>
                        <th scope="col" className="fw-normal th-mid">
                            Beleginfo
                        </th>
                        <th scope="col" className="fw-normal th-right">
                            Ändern
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{expansionData.user}</td>
                        <td className="td-info">{expansionData.info}</td>
                        <td className="journal-table-edit">
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
