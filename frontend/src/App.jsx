import React, { useState } from 'react'
import Quiz from './components/Quiz'
import './index.css'

function App() {
  const [key, setKey] = useState(0)

  const restartQuiz = () => {
    setKey(prev => prev + 1) // Force re-mount of Quiz component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            🎉 90s Fun Quiz 🎉
          </h1>
          <p className="text-xl text-white/90 animate-fade-in">
            Test your knowledge of awesome events from 1990-2000!
          </p>
        </div>
        
        <Quiz key={key} onRestart={restartQuiz} />
      </div>
    </div>
  )
}

export default App 