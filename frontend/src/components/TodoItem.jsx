import { useState } from 'react';
import TodoForm from './TodoForm';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUpdate = async (formData) => {
    const result = await onUpdate(todo._id, formData);
    if (result.success) {
      setIsEditing(false);
    }
    return result;
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Todo</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <TodoForm
          onSubmit={handleUpdate}
          initialData={{
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority,
            dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
          }}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg fade-in ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo._id)}
          className="mt-1 flex-shrink-0"
        >
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-primary-500'
          }`}>
            {todo.completed && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <h3 className={`text-lg font-semibold ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`mt-1 text-sm ${
                  todo.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[todo.priority]}`}>
                  {todo.priority.toUpperCase()}
                </span>
                
                {todo.dueDate && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    📅 {formatDate(todo.dueDate)}
                  </span>
                )}

                {todo.completed && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(todo._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;