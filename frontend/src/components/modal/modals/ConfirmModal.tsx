import { useModal } from "../ModalProvider";

const ConfirmModal = () => {
    const { closeModal, getModalProps } = useModal();
    const { title, callback } : { title: string, callback: Function } = getModalProps();

    return (
        <div className="text-white pt-1">
            <p className="text-white text-sm">{title}</p>
            <div className="grid gap-3 mt-3">
                <button onClick={() => {
                    callback();
                    closeModal();
                }} className="btn">Yes</button>
                <button onClick={closeModal} className="btn">No</button>
            </div>
        </div>
    )
}

export default ConfirmModal;    