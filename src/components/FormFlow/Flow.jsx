import React, { useState } from 'react';
import FormFlow from './Flow/FormFlow';
import FlowHeader from './FlowHeader/FlowHeader';
import style from './Flow.module.css';

const Flow = () => {
  // Setting the light and dark mode
  const [light, setLight] = useState(true);

  // Function to toggle between light and dark mode
  const toggleLightMode = () => setLight((prevLight) => !prevLight);

  return (
    <div className={`${style.flowContainer} ${light ? style.light : style.dark}`}>
      <FlowHeader toggleLightMode={toggleLightMode} light={light} />
      <FormFlow light={light} />
    </div>
  );
};

export default Flow;
