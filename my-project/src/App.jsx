import { useState, useEffect } from 'react';
import TaskStats from './components/TaskStats';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import TodoItem from './components/TodoItem';
import './App.css';

const INITIAL_TASKS = [
  { id: '1', title: '🚀 Set up project repository and structure', completed: true, priority: 'high' },
  { id: '2', title: '✨ Build reorderable task list component', completed: false, priority: 'high' },
  { id: '3', title: '🎨 Add sleek dark glassmorphism styles and animations', completed: false, priority: 'medium' },
  { id: '4', title: '📱 Verify touch-friendly move up/down controls', completed: false, priority: 'low' },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('todo_app_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [filter, setFilter] = useState('all'); // all, active, completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, high, medium, low
  const [searchQuery, setSearchQuery] = useState('');

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('todo_app_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage:', e);
    }
  }, [tasks]);

  // Add Task
  const handleAddTask = ({ title, priority }) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle Completion
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Edit Task Title
  const handleEditTask = (id, newTitle) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  // Move Up
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    setTasks((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  // Move Down
  const handleMoveDown = (index) => {
    if (index >= tasks.length - 1) return;
    setTasks((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data in dataTransfer
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setTasks((prev) => {
      const updated = [...prev];
      const [draggedItem] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, draggedItem);
      return updated;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Clear Completed
  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search query
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-badge">React Task Manager</div>
        <h1 className="app-title">Task Master</h1>
        <p className="app-subtitle">Organize, prioritize, and drag-and-drop to reorder your tasks</p>
      </header>

      <main className="app-main">
        <TaskStats totalTasks={totalTasks} completedTasks={completedTasks} />
        
        <TodoForm onAddTask={handleAddTask} />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          completedCount={completedTasks}
          onClearCompleted={handleClearCompleted}
        />

        <div className="task-list-section">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No tasks found</h3>
              <p>
                {searchQuery || filter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Add a task above to get started!'}
              </p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTasks.map((task) => {
                // Find original index in full tasks array for accurate reordering
                const originalIndex = tasks.findIndex((t) => t.id === task.id);
                return (
                  <TodoItem
                    key={task.id}
                    task={task}
                    index={originalIndex}
                    totalTasks={tasks.length}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedIndex === originalIndex}
                    isDragOver={dragOverIndex === originalIndex}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>💡 <strong>Tip:</strong> Drag cards or use ▲ ▼ buttons to reorder tasks • Double click task title to edit inline</p>
      </footer>
    </div>
  );
}

export default App;
