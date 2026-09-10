import React, { useState, useRef } from 'react';

export default function TodoItem({
  task,
  index,
  totalTasks,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);
  const inputRef = useRef(null);

  const handleEditSubmit = () => {
    if (editText.trim() && editText.trim() !== task.title) {
      onEdit(task.id, editText.trim());
    } else {
      setEditText(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditText(task.title);
      setIsEditing(false);
    }
  };

  const priorityLabels = {
    high: { text: 'High', class: 'badge-high' },
    medium: { text: 'Medium', class: 'badge-medium' },
    low: { text: 'Low', class: 'badge-low' },
  };

  const priorityInfo = priorityLabels[task.priority] || priorityLabels.medium;

  return (
    <li
      className={`todo-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      <div className="drag-handle" title="Drag to reorder">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="8" cy="6" r="2" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="16" cy="12" r="2" />
          <circle cx="8" cy="18" r="2" />
          <circle cx="16" cy="18" r="2" />
        </svg>
      </div>

      <div className="reorder-controls" title="Move task order">
        <button
          type="button"
          className="reorder-btn"
          disabled={index === 0}
          onClick={() => onMoveUp(index)}
          title="Move Up"
          aria-label="Move Up"
        >
          ▲
        </button>
        <button
          type="button"
          className="reorder-btn"
          disabled={index === totalTasks - 1}
          onClick={() => onMoveDown(index)}
          title="Move Down"
          aria-label="Move Down"
        >
          ▼
        </button>
      </div>

      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkmark"></span>
      </label>

      <div className="task-content">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span
            className="task-title"
            onDoubleClick={() => setIsEditing(true)}
            title="Double click to edit"
          >
            {task.title}
          </span>
        )}
      </div>

      <span className={`priority-badge ${priorityInfo.class}`}>
        {priorityInfo.text}
      </span>

      <div className="item-actions">
        <button
          type="button"
          className="action-btn edit-btn"
          onClick={() => setIsEditing(!isEditing)}
          title="Edit task"
        >
          ✏️
        </button>
        <button
          type="button"
          className="action-btn delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
