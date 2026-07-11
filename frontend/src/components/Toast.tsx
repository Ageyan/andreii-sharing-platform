import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

type ToastProps = {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    children?: React.ReactNode;
};

const Toast = ({ message, type, onClose, children }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__content">
                <p className="toast__message">{message}</p>
                {children && <div className="toast__actions">{children}</div>}
            </div>
            <button className="toast__close-btn" onClick={onClose} type="button">
                <IoMdClose className="toast__close-btn-icon" />
            </button>
        </div>
    );
};

export default Toast;
