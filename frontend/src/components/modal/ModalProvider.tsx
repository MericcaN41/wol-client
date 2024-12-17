import { createContext, useContext, useState } from "react";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";
import DeviceModal from "./modals/DeviceModal";
import ConfirmModal from "./modals/ConfirmModal";
import EditModal from "./modals/EditModal";

const ModalContext = createContext({} as any);

const Modals = {
    DeviceModal,
    ConfirmModal,
    EditModal
}

type Modal = keyof typeof Modals;

export const useModal = (): {
    isModalOpen: boolean,
    openModal: (modalName: Modal, props?: any, exitButton?: boolean) => void,
    closeModal: () => void,
    getModalProps: () => any

} => useContext(ModalContext);

const ModalProvider = (props: { children: React.ReactNode }) => {
    const [modal, setModal] = useState<{
        open: boolean,
        Component: (() => JSX.Element) | null,
        exitButton?: boolean
    }>({
        open: false,
        Component: null
    });
    const [modalProps, setModalProps] = useState<any>({});

    const openModal = (modalName: Modal, props?: any, exitButton?: boolean) => {
        if (Modals[modalName]) {
            setModalProps(props);
            setModal({
                open: true,
                Component: Modals[modalName],
                exitButton
            })
        } else throw new Error("Modal not found");
    }
    const closeModal = () => setModal({
        open: false,
        Component: null,
    });

    const getModalProps = () => modalProps;

    return (
        <ModalContext.Provider value={{ isModalOpen: modal !== null, openModal, closeModal, getModalProps }}>
            <AnimatePresence onExitComplete={() => setModalProps(null)}>
                {
                    (modal.open && modal.Component) &&
                    <Modal exitButton={modal.exitButton ?? true}>
                        <modal.Component />
                    </Modal>
                }
            </AnimatePresence>
            {props.children}
        </ModalContext.Provider>
    )

}

export default ModalProvider;