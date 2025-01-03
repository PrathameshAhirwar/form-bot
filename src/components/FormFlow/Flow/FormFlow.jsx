import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as style from './FormFlow.module.css';

const FormFlow = ({ light, onFlowChange }) => {
  const { userId, formId } = useParams();
  const [localFlow, setLocalFlow] = useState({ steps: [] });
  const [selectedStep, setSelectedStep] = useState(null);
  const [localInputValues, setLocalInputValues] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Define which types should have input fields (only bubble items)
  const BUBBLE_TYPES = ['text', 'image', 'video', 'gif'];

  // Fetch initial flow data
  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched flow data:', data); // Debug log
          
          setLocalFlow(data);
          
          // Initialize input values from steps
          const savedValues = {};
          data.steps.forEach(step => {
            if (BUBBLE_TYPES.includes(step.type) && step.value !== undefined) {
              savedValues[step._id] = step.value;
            }
          });
          
          console.log('Initialized input values:', savedValues); // Debug log
          setLocalInputValues(savedValues);
          
          // Notify parent of initial state
          onFlowChange({
            flow: data,
            inputValues: savedValues
          });
        }
      } catch (error) {
        console.error('Error fetching flow:', error);
      }
    };
    fetchFlow();
  }, [userId, formId]);

  const handleBubbleClick = (type) => {
    const isEndStep = type === 'button';
    const newType = isEndStep || [...BUBBLE_TYPES, 'textInput', 'number', 'email', 'phone', 'date', 'rating'].includes(type) ? type : '';

    const newStep = {
      _id: `temp_${Date.now()}`,
      type: newType,
      label: isEndStep ? 'Submit' : `New ${newType}`,
      properties: {},
      value: '', // Initialize value for new step
      ...(isEndStep && { endStep: true }),
    };

    const updatedFlow = {
      ...localFlow,
      steps: [...localFlow.steps, newStep],
    };
    
    setLocalFlow(updatedFlow);
    onFlowChange({
      flow: updatedFlow,
      inputValues: localInputValues
    });
  };

  const handleInputChange = (stepId, event) => {
    const newValue = event.target.value;
    
    // Update both local input values and the step value in the flow
    const updatedInputValues = {
      ...localInputValues,
      [stepId]: newValue,
    };
    
    const updatedFlow = {
      ...localFlow,
      steps: localFlow.steps.map(step => 
        step._id === stepId ? { ...step, value: newValue } : step
      )
    };
    
    setLocalInputValues(updatedInputValues);
    setLocalFlow(updatedFlow);
    
    onFlowChange({
      flow: updatedFlow,
      inputValues: updatedInputValues
    });
  };

  const handleDeleteStep = (stepId) => {
    const updatedSteps = localFlow.steps.filter(step => step._id !== stepId);
    const updatedFlow = { ...localFlow, steps: updatedSteps };
    
    const { [stepId]: deletedValue, ...remainingValues } = localInputValues;
    setLocalInputValues(remainingValues);
    setLocalFlow(updatedFlow);
    
    if (selectedStep?._id === stepId) {
      setSelectedStep(null);
    }
    
    onFlowChange({
      flow: updatedFlow,
      inputValues: remainingValues
    });
  };

  const handleSubmitForm = () => {
    // Here you can process the form submission logic (e.g., sending the form data to the backend)
    console.log('Form submitted with the following data:', localInputValues);
    setFormSubmitted(true);
  };

  return (
    <div className={`${style.flowContainer} ${light ? style.light : style.dark}`}>
      <div className={style.sidebar}>
        <h3>Bubbles</h3>
        <div className={style.bubbles}>
          <div className={style.item} onClick={() => handleBubbleClick('text')}>
            <span>Text</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('image')}>
            <span>Image</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('video')}>
            <span>Video</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('gif')}>
            <span>GIF</span>
          </div>
        </div>

        <h3>Inputs</h3>
        <div className={style.inputs}>
          <div className={style.item} onClick={() => handleBubbleClick('textInput')}>
            <span>Text</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('number')}>
            <span>Number</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('email')}>
            <span>Email</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('phone')}>
            <span>Phone</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('date')}>
            <span>Date</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('rating')}>
            <span>Rating</span>
          </div>
          <div className={style.item} onClick={() => handleBubbleClick('button')}>
            <span>Buttons</span>
          </div>
        </div>
      </div>

      <div className={style.canvas}>
        <h1>Start</h1>
        {localFlow.steps.map((step) => (
          <div
            key={step._id}
            className={`${style.step} ${selectedStep?._id === step._id ? style.selected : ''}`}
            onClick={() => setSelectedStep(step)}
          >
            <div className={style.stepHeader}>
              <h2>{step.label}</h2>
              <button
                className={style.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStep(step._id);
                }}
              >
                ×
              </button>
            </div>
            
            {/* Render input field only for bubble types */}
            {BUBBLE_TYPES.includes(step.type) && (
              <input
                type="text"
                className={style.input}
                value={step.value || ''}  // Use step.value directly
                onChange={(e) => handleInputChange(step._id, e)}
                placeholder={`Enter ${step.type}`}
              />
            )}
            
            {/* Display-only elements for input types */}
            {!BUBBLE_TYPES.includes(step.type) && step.type !== 'button' && (
              <div >{step.type} Input Field</div>
            )}
            
            {/* Button for button type */}
            {step.type === 'button' && (
              <button
                type="button"
                className={`${style.submitButton} ${step.endStep ? style.endStep : ''}`}
                onClick={step.endStep ? handleSubmitForm : undefined}  // Submit form if it's an end step
              >
                {step.label || 'Submit'}
              </button>
            )}
          </div>
        ))}

        {formSubmitted && <div>Form submitted successfully!</div>}
      </div>
    </div>
  );
};

export default FormFlow;
