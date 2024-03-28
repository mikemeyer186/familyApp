import { useDialog } from '../../contexts/dialogContext';

export default function DialogPWAInstall() {
    const { dialogs, closeDialog } = useDialog();

    /**
     * closes new list dialog
     */
    function handleCloseDialog() {
        closeDialog('installPWARef');
    }

    return (
        <div className="modal fade" id="installPWARef" tabIndex="-1" aria-hidden="true" ref={dialogs.installPWARef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">App installieren</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <span>1. Tippe auf den &quot;Teilen&quot;</span>
                            <div className="icon-instruction">
                                <img src="/assets/icons/box-arrow-up.svg" alt="Share" />
                            </div>
                        </div>
                        <br />
                        <div>
                            <span>2. Navigiere dann zu &quot;Zum Homescreen hinzufügen&quot;</span>
                            <div className="icon-instruction">
                                <img src="/assets/icons/plus-square.svg" alt="Share" />
                            </div>
                            <br />
                            <br />
                            <div className="width-full">oder auf einem Mac:</div>
                            <span>Navigiere zu &quot;Zum Dock hinzufügen&quot;</span>
                            <div className="icon-instruction">
                                <img src="/assets/icons/plus-square.svg" alt="Share" />
                            </div>
                        </div>
                        <br />
                        <div>
                            <span>3. Schließe dann den Browser und starte die App direkt vom deinem Homescreen oder deinem Dock</span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
