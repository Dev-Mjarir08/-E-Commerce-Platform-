import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import ConfirmModal from '../components/common/ConfirmModal';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'default',
    isAlert: false
  });

  const resolverRef = useRef(null);

  const confirm = useCallback(({
    title = 'Please Confirm',
    message = 'Are you sure you want to proceed with this operation?',
    confirmText = 'Proceed',
    cancelText = 'Cancel',
    type = 'default'
  }) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModalState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        isAlert: false
      });
    });
  }, []);

  const alert = useCallback(({
    title = 'System Notice',
    message = '',
    confirmText = 'Understood',
    type = 'info'
  }) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModalState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText: '',
        type,
        isAlert: true
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  const value = useMemo(() => ({
    confirm,
    alert
  }), [confirm, alert]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
        isAlert={modalState.isAlert}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ModalProvider');
  }
  return context;
};

export const useModal = useConfirm;

export default ModalContext;
