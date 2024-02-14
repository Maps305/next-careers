import pickle
from flask import Flask, request, jsonify  # Use Flask for the server

app = Flask(__name__)

# Load pickled model components
vectorizer = pickle.load(open('models\vectorizer.pickle', 'rb'))
similarity_matrix = pickle.load(open('models\similarity_matrix.pickle', 'rb'))
recommend_function = pickle.load(open('models\recommendation_function.pickle', 'rb'))

@app.route('/recommendations', methods=['POST'])
def receive_skills():
  if request.method == 'POST':
    skills = request.form.get('skills').split(',')  # Extract skills from form data
    if skills:
      # Preprocess skills (optional)

      user_vector = vectorizer.transform([skills])
      recommendations = recommend_function(user_vector, similarity_matrix)
      return jsonify(recommendations)  # Return recommendations as JSON
    else:
      return jsonify({'error': 'No skills provided'}), 400  # Handle missing skills error
  else:
    return jsonify({'error': 'Invalid request method'}), 4
