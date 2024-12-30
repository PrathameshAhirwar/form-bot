import React, { useState } from 'react';
import style from './Modal.module.css';

const Modal = ({ title, onClose, onSave, deleteAction, inputPlaceholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    onSave(inputValue);
    setInputValue('');
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <h3>{title}</h3>
        {/* Show input field only if it's for creating a folder or form */}
        {!deleteAction && (
          <input
            type="text"
            placeholder={inputPlaceholder || `Enter ${title.toLowerCase()} name`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={style.modalInput}
          />
        )}

        <div className={style.modalActions}>
          {/* If it's a delete action, show confirm/cancel buttons */}
          {deleteAction ? (
            <>
              <p>Are you sure you want to delete this {title.toLowerCase()}?</p>
              <button onClick={onSave} className={style.doneButton}>
                Confirm
              </button>
              <button onClick={onClose} className={style.cancelButton}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className={style.doneButton} disabled={!inputValue.trim()}>
                Done
              </button>
              <button onClick={onClose} className={style.cancelButton}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
