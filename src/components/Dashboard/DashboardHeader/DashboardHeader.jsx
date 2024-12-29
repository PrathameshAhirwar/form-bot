import React, { useState } from 'react';
import style from './dashboardHeader.module.css';

const DashboardHeader = ({ toggleLightMode, light , name }) => {
  const onToggle = (e) => {
    toggleLightMode();
  };

  return (
    <div className={`${style.container} ${light ? style.light : style.dark}`}>
      <div className={style.dropdownContainer}>
        <select name="" id="" className={style.dropdown}>
          <option value="" className={style.option}>
           {`${name}'s Workspace`}
          </option>
          <option value="" className={style.setting}>
            Setting
          </option>
          <option value="" className={style.logout}>
            Logout
          </option>
        </select>
      </div>
      <div className={style.btnContainer}>
        <div className={style.toggle}>
          <h3>Light</h3>
          <label className={style.switch}>
            <input type="checkbox" onChange={onToggle} checked={!light} />
            <span className={style.slider}></span>
          </label>
          <h3>Dark</h3>
        </div>
        <div className={style.btn}>
          <p>Share</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
