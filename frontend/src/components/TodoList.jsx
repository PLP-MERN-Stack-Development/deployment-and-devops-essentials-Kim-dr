import { useState, useEffect } from 'react';
import { todoAPI } from '../services/api';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    console.log('🔵 useEffect triggered - fetching todos');
    fetchTodos();
  }, [filter, sortBy]);

  const fetchTodos = async () => {
    try {
      console.log('🔵 Fetching todos with filter:', filter, 'sort:', sortBy);
      setLoading(true);
      const params = {};
      
      if (filter === 'completed') params.completed = true;
      if (filter === 'active') params.completed = false;
      if (sortBy !== 'newest') params.sort = sortBy;

      console.log('🔵 API params:', params);
      const response = await todoAPI.getAll(params);
      console.log('✅ Todos fetched:', response.data.data);
      setTodos(response.data.data);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching todos:', err);
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      console.log('🔵 handleAddTodo called with:', todoData);
      console.log('🔵 Making API call to create todo...');
      
      const response = await todoAPI.create(todoData);
      console.log('✅ API response:', response.data);
      
      const newTodo = response.data.data;
      console.log('✅ New todo:', newTodo);
      
      setTodos([newTodo, ...todos]);
      console.log('✅ Todos state updated');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Error creating todo:', err);
      console.error('❌ Error response:', err.response?.data);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to create todo' 
      };
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      console.log('🔵 Updating todo:', id, todoData);
      const response = await todoAPI.update(id, todoData);
      console.log('✅ Todo updated:', response.data.data);
      setTodos(todos.map(todo => todo._id === id ? response.data.data : todo));
      return { success: true };
    } catch (err) {
      console.error('❌ Error updating todo:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update todo' 
      };
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      console.log('🔵 Toggling todo:', id);
      const response = await todoAPI.toggle(id);
      console.log('✅ Todo toggled:', response.data.data);
      setTodos(todos.map(todo => todo._id === id ? response.data.data : todo));
    } catch (err) {
      console.error('❌ Error toggling todo:', err);
      setError('Failed to toggle todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      console.log('🔵 Deleting todo:', id);
      await todoAPI.delete(id);
      console.log('✅ Todo deleted');
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('❌ Error deleting todo:', err);
      setError('Failed to delete todo');
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  console.log('🔵 Rendering TodoList. Stats:', stats);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
        <TodoForm onSubmit={handleAddTodo} />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No todos yet. Create one above!</p>
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handleToggleTodo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;