import React from 'react'

const ResultsSummary = ({ results, onRestart }) => {
  const { score, total, percentage, results: questionResults } = results

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreEmoji = () => {
    if (percentage >= 90) return '🏆'
    if (percentage >= 80) return '🎉'
    if (percentage >= 70) return '😊'
    if (percentage >= 60) return '😐'
    return '😅'
  }

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a 90s expert!"
    if (percentage >= 80) return "Excellent! You really know your 90s!"
    if (percentage >= 70) return "Great job! You have good 90s knowledge!"
    if (percentage >= 60) return "Not bad! You know some 90s trivia!"
    return "Keep learning! The 90s were amazing!"
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getScoreEmoji()}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">{getPerformanceMessage()}</p>
        </div>

        {/* Score Summary */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
              {score}/{total}
            </div>
            <div className={`text-3xl font-semibold mb-2 ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-gray-600">
              You got {score} out of {total} questions correct!
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📋 Detailed Results
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questionResults.map((result, index) => (
              <div 
                key={result.question_id}
                className={`p-4 rounded-lg border-l-4 ${
                  result.is_correct 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-semibold text-gray-500 mr-3">
                        Q{index + 1}
                      </span>
                      <span className={`text-lg ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                        {result.is_correct ? '✅' : '❌'}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 font-medium mb-3">
                      {result.question}
                    </p>
                    
                    <div className="text-sm space-y-1">
                      {result.user_answer !== null ? (
                        <div>
                          <span className="font-semibold text-gray-600">Your answer: </span>
                          <span className={result.is_correct ? 'text-green-600' : 'text-red-600'}>
                            {result.question.options ? result.question.options[result.user_answer] : 'Invalid answer'}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-gray-500 italic">No answer provided</span>
                        </div>
                      )}
                      
                      {!result.is_correct && (
                        <div>
                          <span className="font-semibold text-gray-600">Correct answer: </span>
                          <span className="text-green-600">{result.correct_option}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Success Rate Badge */}
                  <div className="ml-4 text-center">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Success Rate</div>
                      <div className="text-sm font-bold text-blue-600">
                        {result.success_rate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="btn-primary text-lg px-8 py-4"
          >
            🔄 Try Again
          </button>
          
          <button
            onClick={() => {
              const text = `I just scored ${score}/${total} (${percentage}%) on the 90s Fun Quiz! 🎉`;
              if (navigator.share) {
                navigator.share({ text });
              } else {
                navigator.clipboard.writeText(text);
                alert('Score copied to clipboard!');
              }
            }}
            className="btn-secondary text-lg px-8 py-4"
          >
            📤 Share Score
          </button>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🎯 Challenge your friends to beat your score!</p>
          <p className="mt-1">✨ The 90s were truly a magical decade!</p>
        </div>
      </div>
    </div>
  )
}

export default ResultsSummary 