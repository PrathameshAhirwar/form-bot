// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import * as style from './Dashboard.module.css';
import { useParams, useNavigate } from 'react-router';
import DashboardDisplay from './folder and form/DashboardDisplay';
import Modal from './Modal/Modal';

const Dashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [light, setLight] = useState(true);
  const [userName, setUserName] = useState(null);
  const [folder, setFolder] = useState([]);
  const [form, setForm] = useState([]);
  const [sharedWorkspaces, setSharedWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentAccessType, setCurrentAccessType] = useState('owner');
  const apiUrl =  process.env.REACT_APP_API_URL;
  // Fetch shared workspaces
  const fetchSharedWorkspaces = async () => {
    try {
      const response = await fetch(`${apiUrl}/workspace/shared`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSharedWorkspaces(data);
      }
    } catch (error) {
      console.error('Error fetching shared workspaces:', error);
    }
  };

  // Fetch user's own workspace data
  const fetchUserWorkspace = async () => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/${userId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setFolder(data.folders || []);
        setForm(data.rootForms || []);
        setUserName(data.userName);
      }
    } catch (error) {
      console.error('Error fetching user workspace:', error);
    }
  };

  // Fetch workspace-specific data
  const fetchWorkspaceData = async (workspaceId) => {
    if (!workspaceId) return;
    
    try {
        const response = await fetch(`https://form-bot-backend-my66.onrender.com/workspace/${workspaceId}/data`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Received workspace data:', data);
            
            // Make sure we're setting both folders and forms
            setFolder(data.folders || []);
            setForm(data.forms || []);
            
            // Log the state updates
            console.log('Updated state:', {
                folders: data.folders?.length || 0,
                forms: data.forms?.length || 0
            });
        } else if (response.status === 403) {
            alert('You do not have access to this workspace');
            setActiveWorkspace(null);
            fetchUserWorkspace();
        } else if (response.status === 404) {
            alert('Workspace not found');
            setActiveWorkspace(null);
        }
    } catch (error) {
        console.error('Error fetching workspace data:', error);
        alert('Failed to fetch workspace data');
    }
};
  // Handle workspace change
  const handleWorkspaceChange = (workspaceId) => {
    if (!workspaceId || workspaceId === userId) {
      setActiveWorkspace(null);
      setCurrentAccessType('owner');
      fetchUserWorkspace();
      return;
    }

    const selectedWorkspace = sharedWorkspaces.find(ws => ws.ownerId === workspaceId);
    if (selectedWorkspace) {
      setActiveWorkspace(workspaceId);
      setCurrentAccessType(selectedWorkspace.accessType);
      fetchWorkspaceData(workspaceId);
    }
  };

  // Handle sharing workspace
  const handleShare = async ({ email, accessType }) => {
    try {
      const response = await fetch(`${apiUrl}/workspace/${userId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, accessType }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setIsShareModalOpen(false);
      alert('Workspace shared successfully');
      fetchSharedWorkspaces();
    } catch (error) {
      console.error('Error sharing workspace:', error);
      alert('Failed to share workspace');
    }
  };

  const toggleLightMode = () => setLight(prevLight => !prevLight);

  // Initial data fetch
  useEffect(() => {
    fetchUserWorkspace();
    fetchSharedWorkspaces();
  }, [userId]);

  return (
    <div className={light ? style.light : style.dark}>
      <DashboardHeader
        toggleLightMode={toggleLightMode}
        light={light}
        name={userName || 'User'}
        onShare={() => currentAccessType === 'owner' && setIsShareModalOpen(true)}
        sharedWorkspaces={sharedWorkspaces}
        onWorkspaceChange={handleWorkspaceChange}
        activeWorkspace={activeWorkspace}
      />
      <DashboardDisplay
        form={form}
        folder={folder}
        readOnly={currentAccessType === 'view'}
      />
      {isShareModalOpen && (
        <Modal
          title="Share Workspace"
          onClose={() => setIsShareModalOpen(false)}
          onSave={handleShare}
          inputPlaceholder="Enter user email"
          isShareModal={true}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Dashboard;