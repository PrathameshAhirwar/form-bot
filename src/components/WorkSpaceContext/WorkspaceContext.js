import React, { createContext, useState, useContext } from 'react';

// Create the context
const WorkspaceContext = createContext();

// Provide context to your app
export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hook to use the Workspace context
export const useWorkspace = () => useContext(WorkspaceContext);
