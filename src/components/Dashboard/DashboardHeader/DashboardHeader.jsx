import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import * as style from './dashboardHeader.module.css';

const DashboardHeader = ({
  toggleLightMode,
  light,
  name,
  onShare,
  sharedWorkspaces = [],
  onWorkspaceChange,
  activeWorkspace 
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out');
    }
  };

  const handleWorkspaceSwitch = (workspaceId) => {
    if (workspaceId === 'logout') {
      handleLogout();
      return;
    }
    
    if (workspaceId) {
      onWorkspaceChange(workspaceId);
    }
  };

  return (
    <div className={`${style.container} ${light ? style.light : style.dark}`}>
      <div className={style.dropdownContainer}>
        <select
          className={style.dropdown}
          onChange={(e) => handleWorkspaceSwitch(e.target.value)}
          value={activeWorkspace || ''}
        >
          <option value="">{name}'s Workspace</option>
          {Array.isArray(sharedWorkspaces) && sharedWorkspaces.map((workspace) => (
            <option 
              key={workspace.ownerId} 
              value={workspace.ownerId}
            >
              {workspace.ownerName}'s Workspace ({workspace.accessType})
            </option>
          ))}
          <option value="logout">Logout</option>
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
        <div className={style.btn} onClick={onShare}>
          <p>Share</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
