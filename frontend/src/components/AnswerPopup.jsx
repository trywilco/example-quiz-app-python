import React, { useState, useEffect } from 'react'

const AnswerPopup = ({ data, onClose }) => {
  const [stats, setStats] = useState(null)
  const { question, userAnswer, isCorrect, correctAnswer } = data

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CODESPACE_BACKEND_URL || 'http://localhost:3000'}/api/stats`)
      if (response.ok) {
        const statsData = await response.json()
        const questionStats = statsData[question.id.toString()]
        setStats(questionStats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const getSuccessRate = () => {
    if (!stats || stats.total_attempts === 0) return 0
    return Math.round((stats.correct_answers / stats.total_attempts) * 100)
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          {/* Result Icon */}
          <div className="mb-4">
            {isCorrect ? (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Result Text */}
          <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
          </h3>

          {/* Answer Details */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
            <div className="mb-3">
              <span className="font-semibold text-gray-700">Your answer: </span>
              <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {question.options[userAnswer]}
              </span>
            </div>
            {!isCorrect && (
              <div>
                <span className="font-semibold text-gray-700">Correct answer: </span>
                <span className="font-medium text-green-600">
                  {question.options[correctAnswer]}
                </span>
              </div>
            )}
          </div>

          {/* Statistics */}
          {stats && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Question Stats</h4>
              <div className="text-sm text-blue-700">
                <div className="flex justify-between mb-1">
                  <span>Success Rate:</span>
                  <span className="font-semibold">{getSuccessRate()}%</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Correct Answers:</span>
                  <span className="font-semibold">{stats.correct_answers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Attempts:</span>
                  <span className="font-semibold">{stats.total_attempts}</span>
                </div>
              </div>
              
              {/* Visual Progress Bar */}
              <div className="mt-3">
                <div className="bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${getSuccessRate()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnswerPopup 