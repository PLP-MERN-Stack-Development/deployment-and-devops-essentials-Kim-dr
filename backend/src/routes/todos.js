import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/auth.js';
import { limiter } from '../middleware/security.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Apply rate limiting to all todo routes
router.use(limiter);

// All routes require authentication
router.use(protect);

// @route   GET /api/todos
// @desc    Get all todos for logged in user
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const { completed, priority, sort } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    if (priority) {
      query.priority = priority;
    }

    // Build sort
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'priority') sortOption = { priority: -1, createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };

    const todos = await Todo.find(query).sort(sortOption);

    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/todos/:id
// @desc    Get single todo
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id
    });

    logger.info(`New todo created by user ${req.user.email}: ${title}`);

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    let todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { title, description, completed, priority, dueDate } = req.body;

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority, dueDate },
      { new: true, runValidators: true }
    );

    logger.info(`Todo updated by user ${req.user.email}: ${todo.title}`);

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.findByIdAndDelete(req.params.id);

    logger.info(`Todo deleted by user ${req.user.email}: ${todo.title}`);

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
});

export default router;