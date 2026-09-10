import React from 'react';

export default function FilterBar({
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery,
  completedCount,
  onClearCompleted
}) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="segmented-control">
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              className={`segmented-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <select
          className="priority-filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {completedCount > 0 && (
          <button className="clear-completed-btn" onClick={onClearCompleted}>
            Clear Completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}
