import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FormFlow from './Flow/FormFlow';
import FlowHeader from './FlowHeader/FlowHeader';
import style from './Flow.module.css';

const Flow = ({ initialFormName = '', initialFormDescription = '' }) => {
  const [light, setLight] = useState(true);
  const [formName, setFormName] = useState(initialFormName);
  const [formDescription, setFormDescription] = useState(initialFormDescription);

  const { userId, formId } = useParams();
  const navigate = useNavigate();

  
  const toggleLightMode = () => setLight((prevLight) => !prevLight);
  // Save Form Handler
  const handleSaveForm = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          isPublished: false,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Saved form:', result.form);
        navigate(`/dashboard/${userId}`); // Redirect to dashboard after saving
      } else {
        const error = await response.json();
        console.log('Failed to save the form: ' + error.message);
      }
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div className={`${style.flowContainer} ${light ? style.light : style.dark}`}>
      <FlowHeader
        toggleLightMode={toggleLightMode}
        light={light}
        formName={formName}
        setFormName={setFormName}
        handleSaveForm={handleSaveForm}  // Pass the save handler
      />
      <FormFlow
        light={light}
        formName={formName}
        setFormName={setFormName}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
      />
    </div>
  );
};

export default Flow;
