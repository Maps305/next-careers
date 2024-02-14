import pickle
from flask import Flask, request, jsonify  # Use Flask for the server

app = Flask(__name__)

# Load pickled model components
vectorizer = pickle.load(open('vectorizer.pickle', 'rb'))
similarity_matrix = pickle.load(open('similarity_matrix.pickle', 'rb'))
recommend_function = pickle.load(open('recommendation_function.pickle', 'rb'))

@app.route('/recommendations', methods=['POST'])
def receive_skills():
  if request.method == 'POST':
    skills = request.form.get('skills').split(',')  # Extract skills from data
    if skills:
      # Preprocess skills 
      user_vector = vectorizer.transform([skills])
      recommendations = recommend_function(user_vector, similarity_matrix)
      response = jsonify(recommendations)
      response.headers['Access-Control-Allow-Origin'] = '*'  # Allow all origins
      return response  # Return recommendations as JSON
    else:
      return jsonify({'error': 'No skills provided'}), 400  # Handle missing skills error
  else:
    return jsonify({'error': 'Invalid request method'}), 4
  

if __name__ == '__main__':
   app.run(port=5000)
