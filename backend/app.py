from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# In-memory storage
quiz_questions = [
    {
        "id": 1,
        "question": "What gaming console launched in 1995 and revolutionized the gaming industry?",
        "options": ["Nintendo 64", "PlayStation", "Sega Saturn", "Atari Jaguar"],
        "correct": 1,
        "year": 1995
    },
    {
        "id": 2,
        "question": "Which phenomenon started in 1996 where people carried virtual pets that needed constant care?",
        "options": ["Furby", "Tamagotchi", "Pokémon", "Beanie Babies"],
        "correct": 1,
        "year": 1996
    },
    {
        "id": 3,
        "question": "What movie became the highest-grossing film of all time when it was released in 1997?",
        "options": ["The Matrix", "Titanic", "Jurassic Park", "Star Wars Episode I"],
        "correct": 1,
        "year": 1997
    },
    {
        "id": 4,
        "question": "Which book series about a young wizard debuted in 1997 and became a global phenomenon?",
        "options": ["Lord of the Rings", "Chronicles of Narnia", "Harry Potter", "Percy Jackson"],
        "correct": 2,
        "year": 1997
    },
    {
        "id": 5,
        "question": "What search engine was founded in 1998 and changed how we find information?",
        "options": ["Yahoo", "AltaVista", "Google", "Ask Jeeves"],
        "correct": 2,
        "year": 1998
    },
    {
        "id": 6,
        "question": "Which animated movie was the first fully computer-animated feature film, released in 1995?",
        "options": ["The Lion King", "Toy Story", "A Bug's Life", "Shrek"],
        "correct": 1,
        "year": 1995
    },
    {
        "id": 7,
        "question": "What gaming console launched in 1996 featuring 64-bit graphics?",
        "options": ["PlayStation", "Sega Saturn", "Nintendo 64", "Dreamcast"],
        "correct": 2,
        "year": 1996
    },
    {
        "id": 8,
        "question": "Which movie released in 1999 introduced 'bullet time' visual effects?",
        "options": ["Fight Club", "The Matrix", "American Beauty", "The Sixth Sense"],
        "correct": 1,
        "year": 1999
    },
    {
        "id": 9,
        "question": "What file-sharing service launched in 1999 and revolutionized music distribution?",
        "options": ["iTunes", "Napster", "LimeWire", "Kazaa"],
        "correct": 1,
        "year": 1999
    },
    {
        "id": 10,
        "question": "Which theme park opened in France in 1992, bringing Disney magic to Europe?",
        "options": ["Disneyland Paris", "Europa-Park", "PortAventura", "Alton Towers"],
        "correct": 0,
        "year": 1992
    }
]

# In-memory user sessions and statistics
user_sessions = {}
question_stats = {str(q["id"]): {"total_attempts": 0, "correct_answers": 0} for q in quiz_questions}

@app.route('/api/questions', methods=['GET'])
def get_questions():
    """Return all quiz questions"""
    logger.info("GET /api/questions - Fetching quiz questions")
    return jsonify({
        "questions": quiz_questions,
        "total": len(quiz_questions)
    })

@app.route('/api/submit', methods=['POST'])
def submit_answers():
    """Submit user answers and calculate results"""
    try:
        logger.info("POST /api/submit - Received submission request")
        data = request.get_json()
        
        if data is None:
            logger.error("No JSON data received")
            return jsonify({"error": "No JSON data provided"}), 400
        
        logger.debug(f"Received data: {data}")
        user_answers = data.get('answers', {})
        session_id = data.get('session_id', str(uuid.uuid4()))
        logger.info(f"Processing submission for session: {session_id}")
        
        # Calculate score and update statistics
        results = []
        correct_count = 0
        
        for question in quiz_questions:
            question_id = str(question["id"])
            user_answer = user_answers.get(question_id)
            is_correct = user_answer == question["correct"]
            
            if user_answer is not None:
                # Update question statistics
                question_stats[question_id]["total_attempts"] += 1
                if is_correct:
                    question_stats[question_id]["correct_answers"] += 1
                    correct_count += 1
            
            # Calculate success rate for this question
            total_attempts = question_stats[question_id]["total_attempts"]
            correct_answers = question_stats[question_id]["correct_answers"]
            success_rate = (correct_answers / total_attempts * 100) if total_attempts > 0 else 0
            
            results.append({
                "question_id": question["id"],
                "question": question["question"],
                "user_answer": user_answer,
                "correct_answer": question["correct"],
                "correct_option": question["options"][question["correct"]],
                "is_correct": is_correct,
                "success_rate": round(success_rate, 1)
            })
        
        # Store session results
        session_results = {
            "answers": user_answers,
            "results": results,
            "score": correct_count,
            "total": len(quiz_questions),
            "percentage": round((correct_count / len(quiz_questions)) * 100, 1),
            "completed_at": datetime.now().isoformat()
        }
        
        user_sessions[session_id] = session_results
        logger.info(f"Session {session_id} completed with score: {correct_count}/{len(quiz_questions)}")
        
        return jsonify({
            "session_id": session_id,
            "score": correct_count,
            "total": len(quiz_questions),
            "percentage": session_results["percentage"],
            "results": results
        })
        
    except Exception as e:
        logger.error(f"Error processing submission: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall question statistics"""
    logger.info("GET /api/stats - Fetching question statistics")
    return jsonify(question_stats)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    logger.info("GET /health - Health check requested")
    return jsonify({"status": "healthy", "message": "Backend is running"})

if __name__ == '__main__':
    import sys
    print("🔧 DEBUG: Script is starting...")
    print(f"🔧 DEBUG: Python version: {sys.version}")
    print("🔧 DEBUG: About to start Flask...")
    logger.info("Starting Flask application on 0.0.0.0:3000")
    print("🔧 DEBUG: Flask app.run() called")
    try:
        app.run(debug=True, port=3000, host='0.0.0.0')
    except Exception as e:
        print(f"❌ ERROR starting Flask: {e}")
        import traceback
        traceback.print_exc() 