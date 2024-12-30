import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import style from './FormFlow.module.css';

const FormFlow = ({ light }) => {
  const { userId, formId } = useParams();
  const [flow, setFlow] = useState({ steps: [], startStep: null });
  const [selectedStep, setSelectedStep] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Fetch flow data
  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setFlow(data);
        }
      } catch (error) {
        console.error('Error fetching flow:', error);
      }
    };
    fetchFlow();
  }, [userId, formId]);

  const handleDragStart = (type) => {
    setDraggedItem(type);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const position = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    try {
      const response = await fetch(`http://localhost:3000/${userId}/form/${formId}/flow/step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: draggedItem,
          label: `New ${draggedItem}`,
          position,
          properties: {},
        }),
      });

      if (response.ok) {
        const newStep = await response.json();
        setFlow((prev) => ({
          ...prev,
          steps: [...prev.steps, newStep],
        }));
      }
    } catch (error) {
      console.error('Error creating step:', error);
    }

    setDraggedItem(null);
  };

  const handleStepClick = (step) => {
    setSelectedStep(step);
  };

  const handleStepMove = async (stepId, newPosition) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${userId}/form/${formId}/flow/step/${stepId}/position`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ position: newPosition }),
        }
      );

      if (response.ok) {
        const updatedFlow = await response.json();
        setFlow(updatedFlow);
      }
    } catch (error) {
      console.error('Error updating step position:', error);
    }
  };

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
        setFlow(updatedFlow);
        if (selectedStep?._id === stepId) {
          setSelectedStep(null);
        }
      }
    } catch (error) {
      console.error('Error deleting step:', error);
    }
  };

  return (
    <div className={`${style.flowContainer} ${light ? style.light : style.dark}`}>
      <div className={style.sidebar}>
      <h3>Bubbles</h3>
        <div className={style.bubbles}>
          
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('text')}
          >
            <span>Text</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('image')}
          >
            <span>Image</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('video')}
          >
            <span>Video</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('gif')}
          >
            <span>GIF</span>
          </div>
        </div>

        <h3>Inputs</h3>
        <div className={style.inputs}>
          
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('textInput')}
          >
            <span>Text</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('number')}
          >
            <span>Number</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('email')}
          >
            <span>Email</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('phone')}
          >
            <span>Phone</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('date')}
          >
            <span>Date</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('rating')}
          >
            <span>Rating</span>
          </div>
          <div
            className={style.item}
            draggable
            onDragStart={() => handleDragStart('buttons')}
          >
            <span>Buttons</span>
          </div>
        </div>
      </div>

      <div
        className={style.canvas}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {flow.steps.map((step) => (
          <div
            key={step._id}
            className={`${style.step} ${selectedStep?._id === step._id ? style.selected : ''}`}
            style={{
              left: step.position.x,
              top: step.position.y,
            }}
            onClick={() => handleStepClick(step)}
            draggable
            onDragEnd={(e) => handleStepMove(step._id, {
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            })}
          >
            <div className={style.stepHeader}>
              <span>{step.label}</span>
              <button
                className={style.deleteBtn}
                onClick={() => handleDeleteStep(step._id)}
              >
                ×
              </button>
            </div>
            <div className={style.stepType}>{step.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormFlow;
