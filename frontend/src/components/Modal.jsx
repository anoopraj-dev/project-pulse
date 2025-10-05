
const Modal = ({isOpen,onClose,message}) => {
   if (!isOpen) {
        return null;
    } 
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs w-[500]">
            <div className="bg-white max-w-md w-full p-6 rounded-sm shadow-x border border-[rgba(117,202,255,0.5)]">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-center">Message</h3>
                    <img
                        src="/close.png"
                        alt="close"
                        className="w-6 h-6 cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                <p className="mt-4 mb-6">{message}</p>
            </div>

        </div>
    )
}

export default Modal;