import React from 'react';
import style from './FlowHeader.module.css';
import { XIcon } from 'lucide-react';

const FlowHeader = ({ toggleLightMode, light, formName, setFormName, handleSaveForm, onCancel }) => {
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

      {/* Flow/Response Button */}
      <div className={style.btnSwitch}>
        <div className={style.flow}>
          <p>Flow</p>
        </div>
        <div className={style.response}>
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
        <div className={`${style.shareBtn} ${light ? style.light : ''}`}>
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
