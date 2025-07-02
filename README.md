# 🎉 90s Fun Quiz App

A full-stack quiz application featuring fun historical events from 1990-2000! Built with Python Flask backend and React frontend with beautiful Tailwind CSS styling.

## ✨ Features

- **10 Fun Questions** about positive historical events from the 1990s
- **Real-time Feedback** with popups showing correct/incorrect answers
- **Live Statistics** showing success rates for each question
- **Detailed Results Summary** with score breakdown and performance metrics
- **Modern UI** with beautiful animations and responsive design
- **In-memory Storage** - no database required
- **Share Score** functionality to challenge friends

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ 
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Flask server:**
   ```bash
   python app.py
   ```
   
   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Open new terminal and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

### 🎮 Using the App

1. Open `http://localhost:3000` in your browser
2. Answer each question by selecting an option
3. Click "Submit Answer" to see immediate feedback
4. View statistics about how others answered
5. Complete all questions to see your final score
6. Share your score and try again!

## 📁 Project Structure

```
├── backend/
│   ├── app.py              # Flask server with API endpoints
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Quiz.jsx           # Main quiz logic
│   │   │   ├── AnswerPopup.jsx    # Answer feedback popup
│   │   │   └── ResultsSummary.jsx # Final results screen
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Tailwind styles
│   ├── index.html          # HTML template
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind configuration
└── README.md
```

## 🔧 API Endpoints

- `GET /api/questions` - Fetch all quiz questions
- `POST /api/submit` - Submit answers and get results
- `GET /api/stats` - Get question statistics

## 🎯 Quiz Topics

Fun and positive events from 1990-2000:
- Gaming console launches (PlayStation, Nintendo 64)
- Technology breakthroughs (Google, DVD, Web)
- Entertainment milestones (Toy Story, Harry Potter, The Matrix)
- Pop culture phenomena (Pokémon, Tamagotchi)

## 🛠️ Development

### Backend Development
- Modify questions in `backend/app.py`
- Add new API endpoints as needed
- Statistics are stored in memory and reset on server restart

### Frontend Development
- Components are in `frontend/src/components/`
- Styling uses Tailwind CSS classes
- Animations and interactions are built-in

### Building for Production
```bash
cd frontend
npm run build
```

## 🎨 Customization

- **Add Questions**: Edit the `quiz_questions` array in `backend/app.py`
- **Styling**: Modify Tailwind classes in components or `frontend/src/index.css`
- **Animations**: Update animation classes in `tailwind.config.js`

## 🚀 Deployment

For production deployment:
1. Build the React frontend (`npm run build`)
2. Serve static files through Flask or a web server
3. Use a production WSGI server like Gunicorn
4. Consider adding a database for persistent storage

---

**Have fun testing your 90s knowledge! 🎊** 