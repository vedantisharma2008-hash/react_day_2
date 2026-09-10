import React from 'react';

export default function TaskStats({ totalTasks, completedTasks }) {
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="task-stats-container">
      <div className="stats-header">
        <div>
          <h2 className="stats-title">Task Progress</h2>
          <p className="stats-subtitle">
            {completedTasks} of {totalTasks} task{totalTasks === 1 ? '' : 's'} completed
          </p>
        </div>
        <div className="percentage-badge">{percentage}%</div>
      </div>
      
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
