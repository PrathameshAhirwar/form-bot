import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as style from './ChatBot.module.css';

const ChatBot = () => {
  const { formId } = useParams();
  const [flowSteps, setFlowSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Start from the first step
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [formCompleted, setFormCompleted] = useState(false); // Track form completion
  const [responses, setResponses] = useState({}); // Store responses
  const [hasStarted, setHasStarted] = useState(false);
  const apiUrl =  process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const response = await fetch(`${apiUrl}/form/${formId}/flow`, { credentials: 'include' });
        if (response.ok) {
          const flowData = await response.json();
          setFlowSteps(flowData.steps);

          const findFirstInteractiveStep = (steps) => {
            for (let i = 0; i < steps.length; i++) {
              if (['textInput', 'date', 'number', 'phone', 'email'].includes(steps[i].type)) {
                return i;
              }
              setChatHistory((prev) => [
                ...prev,
                { sender: 'bot', type: steps[i].type, message: steps[i].value },
              ]);
            }
            return null;
          };

          const initialStepIndex = findFirstInteractiveStep(flowData.steps);
          if (initialStepIndex !== null) {
            setCurrentStepIndex(initialStepIndex);
          }
        } else {
          console.error('Failed to fetch flow data');
        }
      } catch (error) {
        console.error('Error fetching flow:', error);
      }
    };
    const incrementViews = async () => {
      try {
        await fetch(`${apiUrl}/form/${formId}/view`, {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    fetchFlow();
    incrementViews();
  }, [formId]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
  
    // Track start on first message
    if (!hasStarted) {
      setHasStarted(true);
      try {
        await fetch(`${apiUrl}/form/${formId}/response`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            isStart: true,
            responses: [] // Empty responses array for initial start
          }),
        });
      } catch (error) {
        console.error('Error tracking start:', error);
      }
    }
  

    // Save response and continue with existing logic
    const currentStep = flowSteps[currentStepIndex];
    setResponses(prev => ({
      ...prev,
      [currentStep._id]: inputValue,
    }));

    setChatHistory(prev => [
      ...prev,
      { sender: 'user', message: inputValue },
    ]);

    const nextStepIndex = findNextInteractiveStep(currentStepIndex + 1);

    if (nextStepIndex !== null) {
      setCurrentStepIndex(nextStepIndex);
    } else {
      setChatHistory(prev => [
        ...prev,
        { sender: 'bot', message: 'Thank you for completing the form!' },
        { sender: 'bot', message: 'Click below to submit the form:', isSubmitButton: true },
      ]);
      setFormCompleted(true);
    }

    setInputValue('');
  };

  const handleSubmit = async () => {
    try {
      // Transform responses into an array of { stepId, value }
      const formattedResponses = Object.keys(responses).map((stepId) => ({
        stepId,
        value: responses[stepId],
      }));
  
      const formData = {
        responses: formattedResponses,
        isComplete: true // Add this flag
      };
  
      const response = await fetch(`${apiUrl}/form/${formId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
  
      const result = await response.json();
      console.log('Form submitted successfully:', result);
      alert('Form Submitted!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }; 
  

  const findNextInteractiveStep = (index) => {
    while (index < flowSteps.length) {
      const step = flowSteps[index];
      if (['textInput', 'date', 'number', 'phone', 'email'].includes(step.type)) {
        return index;
      }
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', type: step.type, message: step.value },
      ]);
      index++;
    }
    return null;
  };

  const renderInputField = (type) => {
    switch (type) {
      case 'textInput':
        return (
          <input
            type="text"
            placeholder="Type your response..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder="Enter a number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            placeholder="Enter phone number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
      case 'email':
        return (
          <input
            type="email"
            placeholder="Enter email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            placeholder="Enter your response"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        );
    }
  };

  return (
    <div className={style.chatBotContainer}>
      <div className={style.chatWindow}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={chat.sender === 'bot' ? style.botBubble : style.userBubble}
            onClick={() => chat.isSubmitButton && handleSubmit()}
          >
            {chat.type === 'image' || chat.message.startsWith('http') || chat.message.startsWith('data:image') ? (
              <img src={chat.message} alt="Chat Content" className={style.imageBubble} />
            ) : (
              chat.message
            )}
          </div>
        ))}

        {formCompleted ? (
          <div className={style.submitButtonWrapper}>
            <button onClick={handleSubmit} className={style.submitButton}>
              Submit
            </button>
          </div>
        ) : (
          <div className={style.messageGroup} style={{ display: 'flex', alignItems: 'center' }}>
             {renderInputField(flowSteps[currentStepIndex]?.type)}
            <button onClick={handleSend} className={style.sendButton}>
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
