import React from 'react';
import style from './FlowHeader.module.css';
import { XIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

const FlowHeader = ({
  toggleLightMode, 
  light, 
  formName, 
  setFormName, 
  handleSaveForm, 
  onCancel, 
  handleTabSwitch, 
  activeTab
}) => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/form/${formId}/chat`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Shareable link copied to clipboard!');
    });
  };

  return (
    <div className={`${style.container} ${light ? style.light : style.dark}`}>
      {/* Form name input */}
      <div className={style.nameInput}>
        <input
          type="text"
          placeholder="Enter form name"
          className={style.inputText}
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>

      {/* Flow/Response Tabs */}
      <div className={style.btnSwitch}>
        <div
          className={`${style.flow} ${activeTab === 'flow' ? style.activeTab : ''}`}
          onClick={() => handleTabSwitch('flow')}
        >
          <p>Flow</p>
        </div>
        <div
          className={`${style.response} ${activeTab === 'response' ? style.activeTab : ''}`}
          onClick={() => handleTabSwitch('response')}
        >
          <p>Response</p>
        </div>
      </div>

      {/* All button container */}
      <div className={style.btnContainer}>
        <div className={style.toggle}>
          <h3>Light</h3>
          <label className={style.switch}>
            <input type="checkbox" onChange={toggleLightMode} checked={!light} />
            <span className={style.slider}></span>
          </label>
          <h3>Dark</h3>
        </div>
        <div className={`${style.shareBtn} ${light ? style.light : ''}`} onClick={handleShare}>
          <p>Share</p>
        </div>
        <div className={style.saveBtn} onClick={handleSaveForm}>
          <p>Save</p>
        </div>
        <div className={style.cancel} onClick={onCancel}>
          <XIcon />
        </div>
      </div>
    </div>
  );
};

export default FlowHeader;
