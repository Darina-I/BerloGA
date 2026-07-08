import { cross } from "../../assets";

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  isWhiteBG?: boolean;
}

const Modal = ({ onClose, title = "", children, width }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-second-color rounded-lg p-3 ${width || "min-w-1/3"}`}
      >
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-xl font-bold">{title}</p>
          <img
            src={cross}
            width={20}
            className="bg-main-color rounded-lg cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="mt-3 flex flex-col justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
