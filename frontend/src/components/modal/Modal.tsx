import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useModal } from "./ModalProvider";
import { FaTimes } from "react-icons/fa";

const Modal = ({ children, exitButton }: { children: React.ReactNode, exitButton: boolean }) => {
    const { closeModal } = useModal()

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black/80 fixed top-0 left-0 w-full z-[9999] h-screen overflow-auto flex items-center justify-center">
            <motion.div
                initial={{ scale: .8 }}
                animate={{ scale: 1 }}
                exit={{ scale: .8 }}
                className="bg-zinc-700 rounded-lg p-5 pt-2 max-w-[80%] mx-auto w-fit relative">
                {
                    exitButton &&
                    <FaTimes className="absolute top-3 right-3 cursor-pointer text-white text-sm" onClick={() => closeModal()} />
                }
                {children}
            </motion.div>
        </motion.div>,
        document.getElementById("root")!
    )
}

export default Modal;