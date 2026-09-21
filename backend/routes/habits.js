import express from 'express';
import { body, validationResult } from 'express-validator';
import { createHabit, deleteHabitForUser, findHabitByIdForUser, findHabitsByUser, toggleHabitTracking, updateHabitForUser } from '../models/Habit.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET /api/habits
// @desc    Get all habits for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const habits = await findHabitsByUser(req.userId);
    res.json({
      success: true,
      habits
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching habits' 
    });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', [
  body('name').trim().notEmpty().withMessage('Habit name is required')
    .isLength({ max: 100 }).withMessage('Habit name cannot exceed 100 characters'),
  body('icon').optional().isLength({ max: 10 }).withMessage('Icon cannot exceed 10 characters')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, icon } = req.body;

    const habit = await createHabit({ userId: req.userId, name, icon: icon || '📝' });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating habit' 
    });
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Habit name cannot be empty')
    .isLength({ max: 100 }).withMessage('Habit name cannot exceed 100 characters'),
  body('icon').optional().isLength({ max: 10 }).withMessage('Icon cannot exceed 10 characters')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, icon } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;

    const habit = await updateHabitForUser(req.params.id, req.userId, updateData);

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    res.json({
      success: true,
      message: 'Habit updated successfully',
      habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating habit' 
    });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const habit = await deleteHabitForUser(req.params.id, req.userId);

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting habit' 
    });
  }
});

// @route   POST /api/habits/:id/track
// @desc    Toggle tracking for a specific date
// @access  Private
router.post('/:id/track', [
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { date } = req.body;
    
    const habit = await toggleHabitTracking(req.params.id, req.userId, date);

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    res.json({
      success: true,
      message: 'Tracking updated successfully',
      habit
    });
  } catch (error) {
    console.error('Track habit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while tracking habit' 
    });
  }
});

// @route   GET /api/habits/:id/weekly
// @desc    Get weekly analysis for a specific habit
// @access  Private
router.get('/:id/weekly', async (req, res) => {
  try {
    const habit = await findHabitByIdForUser(req.params.id, req.userId);

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    // Calculate weekly data (last 4 weeks)
    const weeks = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7) - today.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      let completedDays = 0;
      let totalDays = 0;

      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const entry = habit.tracking.find(t => t.date === dateStr);
        
        if (d <= today) {
          totalDays++;
          if (entry && entry.completed) {
            completedDays++;
          }
        }
      }

      const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

      weeks.push({
        weekLabel: `Week ${4 - i}`,
        completedDays,
        totalDays,
        percentage
      });
    }

    res.json({
      success: true,
      habitName: habit.name,
      weeks
    });
  } catch (error) {
    console.error('Weekly analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during weekly analysis' 
    });
  }
});

// @route   GET /api/habits/:id/monthly
// @desc    Get monthly analysis for a specific habit
// @access  Private
router.get('/:id/monthly', async (req, res) => {
  try {
    const habit = await findHabitByIdForUser(req.params.id, req.userId);

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Habit not found' 
      });
    }

    // Calculate monthly data (current month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let completedDays = 0;
    let totalDays = 0;

    for (let d = new Date(monthStart); d <= Math.min(monthEnd, now); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const entry = habit.tracking.find(t => t.date === dateStr);
      
      totalDays++;
      if (entry && entry.completed) {
        completedDays++;
      }
    }

    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    res.json({
      success: true,
      habitName: habit.name,
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      completedDays,
      totalDays,
      percentage
    });
  } catch (error) {
    console.error('Monthly analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during monthly analysis' 
    });
  }
});

export default router;
