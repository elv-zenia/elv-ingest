import React, {SetStateAction, useState} from "react";
import {observer} from "mobx-react-lite";
import {Flex, Modal, Text} from "@mantine/core";
import {ElvError} from "components/stream";

interface ConfirmModalProps {
  message: string;
  title: string;
  ConfirmCallback: () => void | Promise<void>;
  CloseCallback: () => void;
  show: boolean;
  loadingText: string;
  cancelText: string;
  confirmText: string;
}

const ConfirmModal = observer(({
   message,
   title,
   ConfirmCallback,
   CloseCallback,
   show,
   loadingText,
   cancelText="Cancel",
   confirmText="Confirm"
 }: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <Modal
      opened={show}
      onClose={CloseCallback}
      title={title}
      padding="32px"
      radius="6px"
      size="lg"
      centered
    >
      <Text>{message}</Text>
      {
        loading && loadingText ?
          <Text>{loadingText}</Text> : null
      }
      {
        !error ? null :
          <div className="modal__error">
            Error: { error }
          </div>
      }
      <Flex direction="row" align="center" className="modal__actions">
        <button type="button" className="button__secondary" onClick={CloseCallback}>
          {cancelText}
        </button>
        <button
          type="button"
          disabled={loading}
          className="button__primary"
          onClick={async () => {
            try {
              setError(undefined);
              setLoading(true);
              await ConfirmCallback();
            } catch(error: unknown) {
              console.error(error);
              let errorMessage;

              if(error instanceof ElvError) {
                errorMessage = error.toString();
              } else if(error instanceof Error) {
                errorMessage = error.message || error.toString();
              }

              setError(errorMessage);
            } finally {
              setLoading(false);
            }
          }}
        >
          { confirmText }
          {/*{loading ? <Loader loader="inline" className="modal__loader"/> : confirmText}*/}
        </button>
      </Flex>
    </Modal>
  );
});

export default ConfirmModal;
