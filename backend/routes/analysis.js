import express from 'express';
import { findHabitsByUser } from '../models/Habit.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET /api/analysis/overview
// @desc    Get overall statistics for all habits
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const habits = await findHabitsByUser(req.userId);

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    let totalHabits = habits.length;
    let totalCompletedToday = 0;
    let monthlyStats = {};

    habits.forEach(habit => {
      // Check today's completion
      const todayStr = today.toISOString().split('T')[0];
      const todayEntry = habit.tracking.find(t => t.date === todayStr);
      if (todayEntry && todayEntry.completed) {
        totalCompletedToday++;
      }

      // Calculate monthly completion
      let monthCompleted = 0;
      let monthTotal = 0;

      for (let d = new Date(monthStart); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const entry = habit.tracking.find(t => t.date === dateStr);
        
        monthTotal++;
        if (entry && entry.completed) {
          monthCompleted++;
        }
      }

      monthlyStats[habit._id] = {
        name: habit.name,
        completed: monthCompleted,
        total: monthTotal,
        percentage: monthTotal > 0 ? Math.round((monthCompleted / monthTotal) * 100) : 0
      };
    });

    res.json({
      success: true,
      totalHabits,
      totalCompletedToday,
      completionRate: totalHabits > 0 ? Math.round((totalCompletedToday / totalHabits) * 100) : 0,
      monthlyStats
    });
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during overview calculation' 
    });
  }
});

// @route   GET /api/analysis/auto
// @desc    Get auto-analysis with most/least followed habits and suggestions
// @access  Private
router.get('/auto', async (req, res) => {
  try {
    const habits = await findHabitsByUser(req.userId);

    if (habits.length === 0) {
      return res.json({
        success: true,
        message: 'No habits found. Create your first habit to get started!',
        mostFollowed: null,
        leastFollowed: null,
        suggestions: ['Start by creating your first habit!']
      });
    }

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate completion percentage for each habit
    const habitStats = habits.map(habit => {
      let completed = 0;
      let total = 0;

      // Start from the later of: start of month OR habit creation date
      let startDate = new Date(monthStart);
      if (habit.createdAt > monthStart) {
        startDate = new Date(habit.createdAt);
        // Reset time to start of day for fair comparison
        startDate.setHours(0, 0, 0, 0);
      }

      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const entry = habit.tracking.find(t => t.date === dateStr);
        
        total++;
        if (entry && entry.completed) {
          completed++;
        }
      }

      const percentage = total > 0 ? (completed / total) * 100 : 0;

      return {
        id: habit._id,
        name: habit.name,
        icon: habit.icon,
        completed,
        total,
        percentage: Math.round(percentage)
      };
    });

    // Sort by percentage
    habitStats.sort((a, b) => b.percentage - a.percentage);

    const mostFollowed = habitStats[0];
    const leastFollowed = habitStats[habitStats.length - 1];

    // Generate suggestions
    const suggestions = [];

    if (leastFollowed.percentage < 30) {
      suggestions.push(`Focus on "${leastFollowed.name}" - try setting a specific time of day for this habit.`);
      suggestions.push(`${leastFollowed.name} needs attention! Consider breaking it into smaller, more manageable steps.`);
    } else if (leastFollowed.percentage < 50) {
      suggestions.push(`You're at ${leastFollowed.percentage}% for "${leastFollowed.name}". You're halfway there - keep pushing!`);
    }

    if (mostFollowed.percentage >= 80) {
      suggestions.push(`Excellent work on "${mostFollowed.name}"! You're at ${mostFollowed.percentage}% completion. Keep it up!`);
    }

    const overallAvg = habitStats.reduce((sum, h) => sum + h.percentage, 0) / habitStats.length;
    
    if (overallAvg < 50) {
      suggestions.push('Your overall completion rate is below 50%. Try focusing on just 2-3 core habits first.');
    } else if (overallAvg >= 70) {
      suggestions.push(`Great job! Your overall completion rate is ${Math.round(overallAvg)}%. You're building strong habits!`);
    }

    // Add general tips
    suggestions.push('Tip: Track your habits at the same time each day to build consistency.');
    suggestions.push('Remember: It takes 21-66 days to form a new habit. Be patient with yourself!');

    res.json({
      success: true,
      mostFollowed,
      leastFollowed,
      overallPercentage: Math.round(overallAvg),
      allHabits: habitStats,
      suggestions
    });
  } catch (error) {
    console.error('Auto-analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during auto-analysis' 
    });
  }
});

// @route   GET /api/analysis/report
// @desc    Download analysis report
// @access  Private
router.get('/report', async (req, res) => {
  try {
    const habits = await findHabitsByUser(req.userId);
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    let report = `HABIT TRACKER REPORT\nGenerated on: ${today.toLocaleString()}\n\n`;
    report += `Total Habits: ${habits.length}\n`;
    report += `----------------------------------------\n\n`;

    habits.forEach(habit => {
      let completed = 0;
      let total = 0;
      
      let startDate = new Date(monthStart);
      if (habit.createdAt > monthStart) {
        startDate = new Date(habit.createdAt);
        startDate.setHours(0, 0, 0, 0);
      }

      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const entry = habit.tracking.find(t => t.date === dateStr);
        total++;
        if (entry && entry.completed) completed++;
      }

      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      report += `Habit: ${habit.icon} ${habit.name}\n`;
      report += `Completion Rate: ${percentage}%\n`;
      report += `Days Tracked: ${total}\n`;
      report += `Days Completed: ${completed}\n`;
      report += `\n`;
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=habit-report.txt');
    res.send(report);

  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ success: false, message: 'Server error generating report' });
  }
});

export default router;
