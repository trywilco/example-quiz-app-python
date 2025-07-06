import React, { useState, useEffect } from 'react'
import AnswerPopup from './AnswerPopup'
import ResultsSummary from './ResultsSummary'

const Quiz = ({ onRestart }) => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupData] = useState(null)
  const [quizComplete, setQuizComplete] = useState(false)
  const [finalResults, setFinalResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_CODESPACE_BACKEND_URL || 'http://localhost:3000'}/api/questions`)
      if (!response.ok) throw new Error('Failed to fetch questions')
      const data = await response.json()
      setQuestions(data.questions)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct

    // Update user answers
    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: selectedAnswer
    }
    setUserAnswers(newAnswers)

    // Show popup with result
    setPopupData({
      question: currentQuestion,
      userAnswer: selectedAnswer,
      isCorrect,
      correctAnswer: currentQuestion.correct
    })
    setShowPopup(true)

    // If this was the last question, prepare final results
    if (currentQuestionIndex === questions.length - 1) {
      await submitFinalAnswers(newAnswers)
    }
  }

  const submitFinalAnswers = async (answers) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CODESPACE_BACKEND_URL || 'http://localhost:8080'}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          session_id: `session_${Date.now()}`
        })
      })
      
      if (!response.ok) throw new Error('Failed to submit answers')
      const results = await response.json()
      setFinalResults(results)
    } catch (err) {
      setError(err.message)
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setSelectedAnswer(null)

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Quiz complete
      setQuizComplete(true)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (quizComplete && finalResults) {
    return <ResultsSummary results={finalResults} onRestart={onRestart} />
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h2>
        <p className="text-gray-600">Please check back later!</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-white/20 rounded-full h-3 mb-6">
        <div 
          className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Counter */}
      <div className="text-center mb-6">
        <span className="text-white/80 text-lg font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
            >
              <span className="font-medium text-lg">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Year: {currentQuestion.year}
          </div>
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="btn-primary"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Submit Answer'}
          </button>
        </div>
      </div>

      {/* Answer Popup */}
      {showPopup && popupData && (
        <AnswerPopup
          data={popupData}
          onClose={handlePopupClose}
        />
      )}
    </div>
  )
}

export default Quiz 