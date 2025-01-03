import React, { useState } from 'react';
import * as style from './Modal.module.css';

const Modal = ({ title, onClose, onSave, deleteAction, inputPlaceholder, isShareModal,userId }) => {
  const [inputValue, setInputValue] = useState('');
  const [accessType, setAccessType] = useState('view');
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState('');
  const apiUrl =  process.env.REACT_APP_API_URL;
  const handleSave = async () => {
    if (isShareModal) {
      try {
        const response = await fetch(`${apiUrl}/workspace/${userId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: inputValue,
            accessType
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          setError(data.message || 'User not found');
          return;
        }

        onSave({ email: inputValue, accessType });
        setInputValue('');
        setError('');
      } catch (err) {
        setError('Failed to share workspace');
      }
    } else {
      onSave(inputValue);
      setInputValue('');
    }
  };

  const generateShareLink = async () => {
    try {
      const response = await fetch(`${apiUrl}/workspace/shareLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ accessType })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShareLink(data.link);
    } catch (err) {
      setError('Failed to generate share link');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setError('Link copied to clipboard!');
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <h3>{title}</h3>
        
        {isShareModal ? (
          <div className={style.shareContent}>
            <div className={style.emailSection}>
              <input
                type="email"
                placeholder="Enter email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={style.modalInput}
              />
              <select 
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className={style.accessSelect}
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
            </div>

            <div className={style.linkSection}>
              {shareLink ? (
                <>
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className={style.modalInput}
                  />
                  <button onClick={copyLink} className={style.doneButton}>
                    Copy Link
                  </button>
                </>
              ) : (
                <button onClick={generateShareLink} className={style.doneButton}>
                  Generate Link
                </button>
              )}
            </div>

            {error && <p className={style.error}>{error}</p>}
          </div>
        ) : !deleteAction ? (
          <input
            type="text"
            placeholder={inputPlaceholder || `Enter ${title.toLowerCase()} name`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={style.modalInput}
          />
        ) : null}

        <div className={style.modalActions}>
          {deleteAction ? (
            <>
              <button onClick={onSave} className={style.doneButton}>
                Confirm
              </button>
              <button onClick={onClose} className={style.cancelButton}>
                Cancel
              </button>
            </>
          ) : isShareModal ? (
            <>
              <button onClick={handleSave} className={style.doneButton} disabled={!inputValue.trim()}>
                Share
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