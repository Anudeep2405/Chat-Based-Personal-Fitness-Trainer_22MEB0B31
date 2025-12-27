# Chat-Based Personal Fitness Trainer

An AI-powered fitness coaching application built for campus hiring assessment. Features personalized workout plans, nutrition advice, and progress tracking using Google Gemini AI.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-18+-green)
![Tech Stack](https://img.shields.io/badge/MongoDB-Latest-brightgreen)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)

## 🎯 Features

- ✅ **AI-Powered Chat** - Personalized fitness advice using Google Gemini API
- ✅ **User Profiles** - Store fitness goals, physical stats, and preferences
- ✅ **Workout Logging** - Track exercises, duration, and calories burned
- ✅ **Progress Charts** - Visualize workout history and statistics
- ✅ **Secure Authentication** - JWT-based user authentication
- ✅ **Server-Side Architecture** - All API calls handled server-side for security

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Vite** - Build tool
- **Native Fetch API** - HTTP requests (no Axios dependency)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **Google Gemini API** - AI integration
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - Local: [MongoDB Community](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
3. **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project

```bash
cd "c:/My Pc/Desktop/spotmiesAI"
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env
```

**⚠️ IMPORTANT: Configure your `.env` file**

Open `backend/.env` and update the following:

```env
# Database Configuration
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/fitness-trainer

# Option 2: MongoDB Atlas (recommended)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/fitness-trainer

# JWT Secret (change this!)
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure

# Google Gemini API Key (required)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd ../frontend

# Install dependencies
npm install
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📝 What You Need to Change

### Required Configuration

1. **MongoDB Connection** (`backend/.env`):
   - Replace `MONGODB_URI` with your database connection string
   - For local MongoDB: `mongodb://localhost:27017/fitness-trainer`
   - For MongoDB Atlas: Get connection string from Atlas dashboard

2. **Gemini API Key** (`backend/.env`):
   - Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Replace `GEMINI_API_KEY` with your actual key

3. **JWT Secret** (`backend/.env`):
   - Change `JWT_SECRET` to a random, secure string
   - Example: `JWT_SECRET=my_super_secret_key_2024_fitness_app`

### Optional Configuration

- **Port Numbers**: Change `PORT` in `backend/.env` if 5000 is in use
- **Frontend URL**: Update `FRONTEND_URL` if deploying to production

## 🗂️ Project Structure

```
spotmiesAI/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── chatController.js     # AI chat logic
│   │   └── progressController.js # Progress tracking
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Workout.js            # Workout schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── chat.js               # Chat routes
│   │   └── progress.js           # Progress routes
│   ├── services/
│   │   └── geminiService.js      # Gemini API wrapper
│   ├── .env.example              # Environment template
│   ├── server.js                 # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx          # Chat interface
│   │   │   ├── WorkoutLog.jsx    # Workout logging
│   │   │   └── ProgressChart.jsx # Charts
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration
│   │   │   └── Dashboard.jsx     # Main dashboard
│   │   ├── utils/
│   │   │   └── api.js            # API wrapper
│   │   ├── App.jsx               # Root component
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Chat
- `POST /api/chat/message` - Send message to AI (protected)
- `GET /api/chat/history` - Get chat history (protected)
- `DELETE /api/chat/history` - Clear chat history (protected)

### Progress
- `POST /api/progress/workout` - Log workout (protected)
- `GET /api/progress/workouts` - Get workout history (protected)
- `GET /api/progress/stats` - Get statistics (protected)
- `DELETE /api/progress/workout/:id` - Delete workout (protected)

## 🎨 Design Principles

This project follows **clean code** and **SOLID principles**:

1. **Single Responsibility** - Each controller handles one domain
2. **Separation of Concerns** - Routes, controllers, models, services are separate
3. **DRY (Don't Repeat Yourself)** - Reusable API wrapper and middleware
4. **Error Handling** - Comprehensive error handling at all levels
5. **Security** - JWT authentication, password hashing, server-side API calls
6. **Validation** - Input validation using Mongoose schemas

## 🔒 Security Features

- ✅ Passwords hashed with bcryptjs
- ✅ JWT token-based authentication
- ✅ API keys hidden server-side (never exposed to frontend)
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Protected routes with authentication middleware

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  fitnessGoal: String,
  fitnessLevel: String,
  targetWeight: Number,
  chatHistory: Array
}
```

### Workout Model
```javascript
{
  user: ObjectId (ref: User),
  type: String,
  name: String,
  duration: Number,
  caloriesBurned: Number,
  intensity: String,
  notes: String,
  workoutDate: Date
}
```

## 🧪 Testing the Application

1. **Register a new user** with your fitness profile
2. **Chat with AI** - Ask for workout plans or nutrition advice
3. **Log workouts** - Add your exercise sessions
4. **View progress** - Check your statistics and charts

### Sample Chat Prompts
- "Create a weekly workout plan for me"
- "Give me nutrition advice for weight loss"
- "What exercises should I do today?"
- "How can I improve my endurance?"

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check if MongoDB is running
- ✅ Verify `.env` file exists and has correct values
- ✅ Ensure port 5000 is not in use

### Frontend can't connect to backend
- ✅ Ensure backend is running on port 5000
- ✅ Check browser console for CORS errors
- ✅ Verify Vite proxy configuration

### Gemini API errors
- ✅ Verify API key is correct
- ✅ Check API quota limits
- ✅ Ensure internet connection is active

## 📦 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

This is a campus hiring assessment project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - Free to use for educational purposes

## 👨‍💻 Author

Built for campus hiring assessment - demonstrating full-stack development skills with clean code principles.

---

**Note**: This project uses minimal dependencies and follows software engineering best practices suitable for campus hiring assessments.
