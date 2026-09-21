# Habit Tracker - Full-Stack Web Application

A beautiful, feature-rich habit tracking application built with React, Node.js, Express, and PostgreSQL. Track your daily habits with a Google Sheets-inspired interface, visualize your progress with charts, and get personalized insights to build better habits.

![Habit Tracker](https://img.shields.io/badge/Stack-PERN-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🔐 Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes and automatic token refresh

### 📊 Habit Tracking
- **Google Sheets-Style Interface**: Clean, familiar table layout
- **Icon/Label Column**: Customize each habit with emojis or labels
- **Daily Checkboxes**: Track completion for every day of the month
- **Quick Actions**: Add, edit, and delete habits with ease
- **Persistent Storage**: All data saved to PostgreSQL

### 📈 Analytics & Insights
- **Weekly Progress Charts**: Visualize 4-week trends with color-coded bars
- **Monthly Overview**: Pie chart showing distribution across all habits
- **Auto-Analysis**: 
  - Identifies most and least followed habits
  - Calculates overall completion rates
  - Generates personalized improvement suggestions
- **Real-time Statistics**: Dashboard with key metrics

### 🎨 Modern UI/UX
- Premium gradient designs
- Smooth animations and transitions
- Fully responsive (desktop, tablet, mobile)
- Dark mode ready (TailwindCSS)
- Lucide icons for crisp visuals

## 🚀 Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- React Query for state management
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- Lucide React for icons

**Backend:**
- Node.js & Express.js
- PostgreSQL with node-postgres
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (local, Docker, or a managed provider)
- npm or yarn

### 1. Clone the Repository
```bash
cd S:\Project\Habits_Tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://habit_tracker:habit_tracker@localhost:5432/habit_tracker

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

The backend creates its `users`, `habits`, and `habit_tracking` tables on first successful connection.

Start the backend server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

1. **Register**: Create a new account with your email and password
2. **Add Habits**: Click "Add Habit" on the Habit Table page
3. **Track Daily**: Click checkboxes to mark habits as complete
4. **View Progress**: Navigate to the Analysis page for insights
5. **Get Tips**: Check personalized suggestions to improve

## 📱 Screenshots

### Login Page
Beautiful gradient authentication with smooth transitions

### Dashboard
Quick overview of your habit statistics and shortcuts

### Habit Table
Google Sheets-style interface with sticky headers and responsive design

### Analysis Page
Charts, insights, and personalized recommendations

## 🌐 Deployment

### Docker

Run the full stack from the repository root:

```bash
docker compose up --build
```

This starts:
- `frontend` at `http://localhost:5173`
- `backend` at `http://localhost:5002`
- `postgres` at `postgresql://habit_tracker:habit_tracker@localhost:5432/habit_tracker`

Important:
- Change `JWT_SECRET` in [docker-compose.yml](/Users/karansinghbhanwal/Streaks/docker-compose.yml) before using this outside local development.
- The frontend container proxies `/api/*` requests to the backend container through Nginx.
- PostgreSQL data is stored in the named Docker volume `postgres-data`.

To stop the stack:

```bash
docker compose down
```

To stop it and remove the database volume:

```bash
docker compose down -v
```

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET`: Strong random string
     - `NODE_ENV`: `production`

### Frontend (Vercel)

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your repository
3. Set the following:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your Render backend URL

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation.

## 🛠️ Development

### Project Structure
```
Habits_Tracker/
├── backend/
│   ├── models/          # PostgreSQL data-access modules
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Utilities
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   └── package.json
└── README.md
```

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start with auto-reload

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- Styling by [TailwindCSS](https://tailwindcss.com)

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using the MERN stack
