import React from 'react';
import style from './FlowHeader.module.css';

const FlowHeader = ({ toggleLightMode, light }) => {
  return (
    <div className={`${style.container} ${light ? style.light : style.dark}`}>
      <div className={style.btnContainer}>
        <div className={style.toggle}>
          <h3>Light</h3>
          <label className={style.switch}>
            <input type="checkbox" onChange={toggleLightMode} checked={!light} />
            <span className={style.slider}></span>
          </label>
          <h3>Dark</h3>
        </div>
        <div className={`${style.btn} ${light ? style.light : ''}`}>
          <p>Share</p>
        </div>
      </div>
    </div>
  );
};

export default FlowHeader;
