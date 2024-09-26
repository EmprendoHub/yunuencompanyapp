import DialogComponent from "./DialogComponent";
import ModalButton from "../buttons/ModalButton";

export default function Confirm(props: any) {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open) {
    return <></>;
  }

  return (
    <DialogComponent open={open} onClose={onClose}>
      <h2 className="text-xl">{title}</h2>
      <div className="py-5">{children}</div>
      <div className="flex justify-end">
        <div className="p-1">
          <ModalButton
            onClick={() => onClose()}
            className="bg-secondary hover:bg-secondary-light"
          >
            No
          </ModalButton>
        </div>
        <div className="p-1">
          <ModalButton
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            Si
          </ModalButton>
        </div>
      </div>
    </DialogComponent>
  );
}
