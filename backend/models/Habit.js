import { query } from '../db.js';

const habitSelect = `SELECT h.id, h.user_id, h.name, h.icon, h.created_at,
  COALESCE(json_agg(json_build_object('date', to_char(t.date, 'YYYY-MM-DD'), 'completed', t.completed) ORDER BY t.date)
    FILTER (WHERE t.date IS NOT NULL), '[]'::json) AS tracking
  FROM habits h LEFT JOIN habit_tracking t ON t.habit_id = h.id`;
const mapHabit = row => row && ({ _id: String(row.id), userId: String(row.user_id), name: row.name, icon: row.icon, createdAt: row.created_at, tracking: row.tracking });

export const findHabitsByUser = async userId => {
  const { rows } = await query(`${habitSelect} WHERE h.user_id = $1 GROUP BY h.id ORDER BY h.created_at DESC`, [userId]);
  return rows.map(mapHabit);
};
export const findHabitByIdForUser = async (id, userId) => {
  const { rows } = await query(`${habitSelect} WHERE h.id = $1 AND h.user_id = $2 GROUP BY h.id`, [id, userId]);
  return mapHabit(rows[0]);
};
export const createHabit = async ({ userId, name, icon }) => {
  const { rows } = await query('INSERT INTO habits (user_id, name, icon) VALUES ($1, $2, $3) RETURNING id', [userId, name, icon]);
  return findHabitByIdForUser(rows[0].id, userId);
};
export const updateHabitForUser = async (id, userId, { name, icon }) => {
  const fields = []; const values = [];
  if (name !== undefined) { values.push(name); fields.push(`name = $${values.length}`); }
  if (icon !== undefined) { values.push(icon); fields.push(`icon = $${values.length}`); }
  if (!fields.length) return findHabitByIdForUser(id, userId);
  values.push(id, userId);
  const { rowCount } = await query(`UPDATE habits SET ${fields.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length}`, values);
  return rowCount ? findHabitByIdForUser(id, userId) : null;
};
export const deleteHabitForUser = async (id, userId) => (await query('DELETE FROM habits WHERE id = $1 AND user_id = $2', [id, userId])).rowCount > 0;
export const toggleHabitTracking = async (id, userId, date) => {
  const habit = await findHabitByIdForUser(id, userId);
  if (!habit) return null;
  await query(`INSERT INTO habit_tracking (habit_id, date, completed) VALUES ($1, $2, TRUE)
    ON CONFLICT (habit_id, date) DO UPDATE SET completed = NOT habit_tracking.completed`, [id, date]);
  return findHabitByIdForUser(id, userId);
};
