import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import style from './FormFlow.module.css';

const FormFlow = ({ light }) => {
  const { userId, formId } = useParams();
  const [flow, setFlow] = useState({ steps: [] });
  const [selectedStep, setSelectedStep] = useState(null);
  const [inputValues, setInputValues] = useState({}); // Track form inputs per step

  const getToken = () => {
    const token = document.cookie
      .split(';')
      .find((row) => row.startsWith('token='))?.split('=')[1];
    return token;
  };

  // Fetch flow data
  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setFlow(data); // Set flow with steps data
        }
      } catch (error) {
        console.error('Error fetching flow:', error);
      }
    };
    fetchFlow();
  }, [userId, formId]);

  // Handle adding a step when a bubble is clicked
  const handleBubbleClick = async (type) => {
    try {
      const isEndStep = type === 'button';
      const newType = isEndStep || ['text', 'image', 'video', 'gif', 'textInput', 'number', 'email', 'phone', 'date', 'rating'].includes(type) ? type : '';

      const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow/step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: newType,
          label: isEndStep ? 'Submit' : `New ${newType}`,
          properties: {},
          ...(isEndStep && { endStep: true }),
        }),
      });

      if (response.ok) {
        const updatedFlow = await response.json();
        setFlow(updatedFlow); // Update flow state with new step
      }
    } catch (error) {
      console.error('Error creating step:', error);
    }
  };

  // Handle input value change for a dynamic form step (like text input)
  const handleInputChange = async (stepId, event) => {
    const newValue = event.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [stepId]: newValue,
    }));

    const yourToken = getToken()
    if (!yourToken) {
      console.error('Token not found');
      return;
    }
    // Update the flow step in the backend with the new value
    try {
      const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow/step/${stepId}/next`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ nextSteps: [newValue] }), // Send updated value
      });

      if (response.ok) {
        const updatedFlow = await response.json();
        setFlow(updatedFlow); // Update flow with the modified step
      }
    } catch (error) {
      console.error('Error updating step:', error);
    }
  };

  // Handle step click to select and view step details
  const handleStepClick = (step) => {
    setSelectedStep(step);
  };

  // Handle deleting a step
  const handleDeleteStep = async (stepId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${userId}/form/${formId}/flow/step/${stepId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const updatedFlow = await response.json();
        setFlow(updatedFlow); // Update flow with new steps array
        if (selectedStep?._id === stepId) {
          setSelectedStep(null);
        }
      }
    } catch (error) {
      console.error('Error deleting step:', error);
    }
  };

  // Handle form submission (optional)
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ steps: flow.steps, inputValues }), // Send all input values and steps
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        // Handle successful submission (redirect, show success message, etc.)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
        {flow.steps.map((step) => (
          <div
            key={step._id}
            className={`${style.step} ${selectedStep?._id === step._id ? style.selected : ''}`}
            onClick={() => handleStepClick(step)}
          >
            <div className={style.stepHeader}>
              <h2>{step.label}</h2>
              <button className={style.deleteBtn} onClick={() => handleDeleteStep(step._id)}>
                ×
              </button>
            </div>

            {/* Render the content based on the type of the step */}
            {step.type === 'text' && (
                <input
                  type="text"
                  className={style.input}
                  value={inputValues[step._id] || ''}
                  onChange={(e) => handleInputChange(step._id, e)}
                  placeholder="Enter text"
                />
            )}

            {step.type === 'textInput' && (
              <input
                type="text"
                className={style.input}
                placeholder={step.placeholder || 'Enter text'}
                value={inputValues[step._id] || ''}
                onChange={(e) => handleInputChange(step._id, e)}
                required
              />
            )}

            {step.type === 'number' && (
              <input
                type="number"
                className={style.input}
                value={inputValues[step._id] || ''}
                onChange={(e) => handleInputChange(step._id, e)}
                required
              />
            )}
            {step.type === 'email' && (
              <input
                type="email"
                className={style.input}
                value={inputValues[step._id] || ''}
                onChange={(e) => handleInputChange(step._id, e)}
                required
              />
            )}
            {step.type === 'phone' && (
              <input
                type="tel"
                className={style.input}
                value={inputValues[step._id] || ''}
                onChange={(e) => handleInputChange(step._id, e)}
                required
              />
            )}
            {step.type === 'date' && (
              <input
                type="date"
                className={style.input}
                value={inputValues[step._id] || ''}
                onChange={(e) => handleInputChange(step._id, e)}
                required
              />
            )}

            {step.type === 'button' && (
              <button
                type="submit"
                className={`${style.submitButton} ${
                  flow.endSteps?.includes(step._id) ? style.endStep : ''
                }`}
                onClick={handleSubmit}
              >
                {step.label || 'Submit'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormFlow;
