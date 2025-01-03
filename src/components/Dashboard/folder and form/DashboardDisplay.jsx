import * as style from './display.module.css';
import { Trash } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const DashboardDisplay = ({ 
  form, 
  folder, 
  openFolderModal, 
  openFormModal, 
  onFolderClick, 
  activeFolder, 
  openDeleteModal,
  readOnly 
}) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  useEffect(() => {
    console.log("dashboard display called")
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.folderContainer}>
          {!readOnly && (
            <div className={style.folderBtn} onClick={openFolderModal}>
              <h4>Create Folder</h4>
            </div>
          )}
          {folder.map((folder, index) => {
            return (
              <div 
                className={`${style.folder} ${activeFolder === folder._id ? style.activeFolder : ''}`}
                key={index}
                onClick={() => onFolderClick(folder._id)}
              >
                <h4>{folder.name}</h4>
                {!readOnly && (
                  <Trash 
                    size={18} 
                    className={style.trashFolder}  
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal('folder', folder._id);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={style.formContainer}>
          {!readOnly && (
            <div className={style.formBtn} onClick={openFormModal}>
              <h3>+</h3>
              <h4>Create Form</h4>
            </div>
          )}
          {form.map((form, index) => {
            return (
              <div 
                className={style.form} 
                key={index} 
                onClick={() => {
                  console.log('Navigating to:', `/dashboard/${userId}/form/${form._id}/flow`);
                  navigate(`/dashboard/${userId}/form/${form._id}/flow`);
                }}
              >
                <h4>{form.name}</h4>
                {!readOnly && (
                  <Trash 
                    size={25} 
                    className={style.trash} 
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal('form', form._id);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DashboardDisplay;