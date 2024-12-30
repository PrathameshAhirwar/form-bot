import React, { useEffect, useState } from 'react';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import style from './Dashboard.module.css';
import { useParams, useNavigate } from 'react-router';
import DashboardDisplay from './folder and form/DashboardDisplay';
import Modal from './Modal/Modal';

const Dashboard = () => {
  // Extracting userId
  const { userId } = useParams();
  const navigate = useNavigate();

  // Setting the light and dark mode
  const [light, setLight] = useState(true);
  // Setting user
  const [userName, setUserName] = useState(null);
  // Fetching the folder
  const [folder, setFolder] = useState([]);
  // Fetching the form
  const [form, setForm] = useState([]);
  // Setting the modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);
  // Deleting the folder or form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState(null);  // 'folder' or 'form'
  const [deleteItemId, setDeleteItemId] = useState(null);  // ID of item to delete




  // Function to toggle between light and dark mode
  const toggleLightMode = () => setLight((prevLight) => !prevLight);


  // Creating a folder
  const createFolder = async (folderName) => {
    try {
      const response = await fetch(`http://localhost:3000/${userId}/createFolder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: folderName }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        setFolder([...folder, newFolder]); // Update the folder state
        setIsFolderModalOpen(false); // Close the modal
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('An error occurred while creating the folder');
    }
  };

  // Creating a form
  const createForm = async (formName) => {
    try {

      const url = activeFolder
      ? `http://localhost:3000/${userId}/folder/${activeFolder}/createForm` // API for creating a form inside a folder
      : `http://localhost:3000/${userId}/createForm`; // API for creating a form in the root


      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: formName }),
        });
        if (response.ok) {
          const newForm = await response.json();
          setForm([...form, newForm]); // Update the form state
          setIsFormModalOpen(false); // Close the modal
        }
        else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to create form');
        }
      }
      catch (error) {
        console.error('Error creating form:', error);
        alert('An error occurred while creating the form');
      }
  };
    
  const fetchFormsForFolder = async (folderId) => {
    try {
        const response = await fetch(`http://localhost:3000/${userId}/folder/${folderId}/forms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            const forms = await response.json();
            setForm(forms); // Update forms for the active folder
            setActiveFolder(folderId); // Set the active folder
            console.log("Active FolderId : " + folderId)
        } else {
            console.error('Error fetching forms for folder');
        }
    } catch (error) {
        console.error('Error fetching forms:', error);
    }
  };

  useEffect(() => {
    if (activeFolder) {
        console.log("Active Folder (Updated): " + activeFolder);
    }
}, [activeFolder]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`http://localhost:3000/dashboard/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName); // Set the userName from the API response
          setFolder(data.folders); // Set the folder from the API response
          console.log(data.folders);
          setForm(data.rootForms); // Set the form from the API response
          console.log(data.rootForms);
        } else if (response.status === 400 || response.status === 403) {
          navigate('/login'); // Redirect to login on unauthorized access
        } else {
          console.error('Error fetching user name');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserName();
  }, [userId, navigate]);

  // Deleting a form or folder
  const handleDelete = async () => {
    try {
      const url = deleteItemType === 'folder'
        ? `http://localhost:3000/${userId}/folder/${deleteItemId}`
        : `http://localhost:3000/${userId}/form/${deleteItemId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        if (deleteItemType === 'folder') {
          setFolder(folder.filter(f => f._id !== deleteItemId));
        } else {
          setForm(form.filter(f => f._id !== deleteItemId));
        }
        setIsDeleteModalOpen(false);
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('An error occurred while deleting the item');
    }
  };

  const openDeleteModal = (itemType, itemId) => {
    setDeleteItemType(itemType);
    setDeleteItemId(itemId);
    setIsDeleteModalOpen(true);
  };


  return (
    <div className={light ? style.light : style.dark}>
      <DashboardHeader toggleLightMode={toggleLightMode} light={light} name={userName || 'User'} />
      <DashboardDisplay
        form={form}
        folder={folder}
        openFolderModal={() => setIsFolderModalOpen(true)}
        openFormModal={() => setIsFormModalOpen(true)}
        onFolderClick={fetchFormsForFolder}
        activeFolder={activeFolder}
        openDeleteModal={openDeleteModal}
      />
      {/* Folder Modal */}
      {isFolderModalOpen && (
        <Modal
          title="Create New Folder"
          onClose={() => setIsFolderModalOpen(false)}
          onSave={createFolder}
        />
      )}
      {/* Form Modal */}
      {isFormModalOpen && (
        <Modal
          title="Create New Form"
          onClose={() => setIsFormModalOpen(false)}
          onSave={createForm}
        />
      )}
      {/* Delete Modal */}
       {isDeleteModalOpen && (
        <Modal
          title={`Are you sure you want to delete this ${deleteItemType}?`}
          onClose={() => setIsDeleteModalOpen(false)}
          onSave={handleDelete}
          deleteAction
        />
      )}

    </div>
  );
};

export default Dashboard;
