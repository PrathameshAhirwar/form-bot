import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FormFlow from './Flow/FormFlow';
import FlowHeader from './FlowHeader/FlowHeader';
import * as style from './Flow.module.css';
import FormResponse from '../FormResponse/FormResponse';

const Flow = ({ initialFormName = '', initialFormDescription = '' }) => {
  const [light, setLight] = useState(true);
  const [formName, setFormName] = useState(initialFormName);
  const [formDescription, setFormDescription] = useState(initialFormDescription);
  const [unsavedChanges, setUnsavedChanges] = useState({
    flow: null,
    inputValues: null
  });
  const [activeTab, setActiveTab] = useState('flow'); // Track active tab

  const { userId, formId } = useParams();
  const navigate = useNavigate();

  const toggleLightMode = () => setLight((prevLight) => !prevLight);

  // Handle changes from FormFlow component
  const handleFlowChange = (changes) => {
    setUnsavedChanges(changes);
  };

  // Save Form Handler
  const handleSaveForm = async () => {
    try {
      const stepsToSave = unsavedChanges.flow.steps.map(({ _id, ...stepData }) => ({
        ...stepData,
        value: stepData.value || ''
      }));

      const formResponse = await fetch(`http://localhost:3000/${userId}/form/${formId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          isPublished: false,
          flow: unsavedChanges.flow,
          steps: stepsToSave
        }),
      });

      if (!formResponse.ok) {
        throw new Error('Failed to save form details');
      }

      const savedForm = await formResponse.json();
      console.log('Form saved successfully:', savedForm); // Debug log

      navigate(`/dashboard/${userId}`);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  // Switch between Flow and Response views
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`${style.flowContainer} ${light ? style.light : style.dark}`}>
      <FlowHeader
        toggleLightMode={toggleLightMode}
        light={light}
        formName={formName}
        setFormName={setFormName}
        handleSaveForm={handleSaveForm}
        onCancel={() => navigate(`/dashboard/${userId}`)}
        handleTabSwitch={handleTabSwitch}
        activeTab={activeTab}
      />
      
      {/* Conditional rendering for Flow or Response */}
      {activeTab === 'flow' ? (
        <FormFlow
          light={light}
          formName={formName}
          setFormName={setFormName}
          formDescription={formDescription}
          setFormDescription={setFormDescription}
          onFlowChange={handleFlowChange}
        />
      ) : (
        <FormResponse formId={formId} userId={userId}/>
      )}
    </div>
  );
};

export default Flow;
