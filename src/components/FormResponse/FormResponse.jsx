import React, { useState, useEffect } from 'react';
import * as style from './FormResponse.module.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const FormResponse = ({ formId }) => {
  const [columns, setColumns] = useState([]);
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState({
    views: 0,
    starts: 0,
    completed: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl =  process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/form/${formId}/responses`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch responses');
        }

        const data = await response.json();
        
        const inputColumns = data.columns.filter(column => 
          ['textInput', 'date', 'number', 'phone', 'email'].includes(column.type)
        );

        setColumns(inputColumns);
        setResponses(data.responses || []);
        setAnalytics(data.analytics || {
          views: 0,
          starts: 0,
          completed: 0,
          completionRate: 0
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchData();
    }
  }, [formId]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const pieData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        data: [
          analytics.completed,
          Math.max(0, (analytics.starts || 0) - (analytics.completed || 0)),
        ],
        backgroundColor: ['#3B82F6', '#909090'],
        hoverBackgroundColor: ['#3B82F6', '#909090'],
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={style.formResponseContainer}>
      {/* Stats Section */}
      <div className={style.statsContainer}>
        <div className={style.statBox}>
          <p className={style.statValue}>{analytics.views}</p>
          <p className={style.statLabel}>Views</p>
        </div>
        <div className={style.statBox}>
          <p className={style.statValue}>{analytics.starts}</p>
          <p className={style.statLabel}>Starts</p>
        </div>
      </div>

      {/* Responses Table */}
      <table className={style.responseTable}>
        <thead>
          <tr>
            <th>Submitted at</th>
            {columns.map(column => (
              <th key={column.id}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <tr key={response.timestamp || index}>
                <td>{formatDate(response.timestamp)}</td>
                {columns.map(column => (
                  <td key={column.id}>
                    {response[column.id] !== undefined ? response[column.id].toString() : ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>
                No responses yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Completion Rate Section */}
      <div className={style.completionSection}>
        <div className={style.doughnutChart}>
        <Doughnut
          data={pieData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          }}
        />
        </div>
        <div className={style.completionDetails}>
          <p>Completed</p>
          <p>{analytics.completed || 0}</p>
        </div>
        <div className={style.completionRate}>
          <p className={style.completionRateLabel}>Completion rate</p>
          <p className={style.completionRateValue}>
            {(analytics.completionRate || 0).toFixed(1)}%
          </p>
        </div>
        
        
      </div>
    </div>


  );
};

export default FormResponse;