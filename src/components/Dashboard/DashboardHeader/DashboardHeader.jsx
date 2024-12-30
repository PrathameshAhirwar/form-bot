import React from 'react';
import style from './dashboardHeader.module.css';
import { useNavigate } from 'react-router';

const DashboardHeader = ({ toggleLightMode, light, name }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include', // Send cookies with the request
      });

      if (response.ok) {
        navigate('/login'); // Redirect to login page on successful logout
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out');
    }
  };

  return (
    <div className={`${style.container} ${light ? style.light : style.dark}`}>
      <div className={style.dropdownContainer}>
        <select
          name=""
          id=""
          className={style.dropdown}
          onChange={(e) => {
            if (e.target.value === 'logout') {
              handleLogout(); // Trigger logout on selection
            }
          }}
        >
          <option value="" className={style.option}>
            {`${name}'s Workspace`}
          </option>
          <option value="settings" className={style.setting}>
            Settings
          </option>
          <option value="logout" className={style.logout}>
            Logout
          </option>
        </select>
      </div>
      <div className={style.btnContainer}>
        <div className={style.toggle}>
          <h3>Light</h3>
          <label className={style.switch}>
            <input type="checkbox" onChange={toggleLightMode} checked={!light} />
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
