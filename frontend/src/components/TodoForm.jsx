import { useState } from 'react';

const TodoForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔵 Form submitted with data:', formData);
    
    if (!formData.title.trim()) {
      setError('Title is required');
      console.log('❌ Error: Title is required');
      return;
    }

    console.log('🔵 Calling onSubmit function...');
    setLoading(true);
    
    try {
      const result = await onSubmit(formData);
      console.log('🔵 Result from onSubmit:', result);
      
      if (result.success) {
        console.log('✅ Todo created successfully!');
        if (!initialData) {
          setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
          console.log('🔵 Form reset');
        }
      } else {
        console.log('❌ Error from API:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('❌ Exception caught:', err);
      setError('Failed to save todo');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Adding...' : initialData ? 'Update Todo' : 'Add Todo'}
      </button>
    </form>
  );
};

export default TodoForm;