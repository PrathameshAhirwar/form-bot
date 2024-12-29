import React, { useEffect, useState } from 'react';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import style from './Dashboard.module.css';
import { useParams, useNavigate } from 'react-router';
import DashboardDisplay from './folder and form/DashboardDisplay';

const Dashboard = () => {
  // Extracting userId
  const { userId } = useParams();
  const navigate = useNavigate();

  // Setting the light and dark mode
  const [light, setLight] = useState(true);
  // Setting user
  const [userName, setUserName] = useState(null);

  // Function to toggle between light and dark mode
  const toggleLightMode = () => setLight((prevLight) => !prevLight);

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

  return (
    <div className={light ? style.light : style.dark}>
      <DashboardHeader toggleLightMode={toggleLightMode} light={light} name={userName || 'User'} />
      <DashboardDisplay />
    </div>
  );
};

export default Dashboard;
