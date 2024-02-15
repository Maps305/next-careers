import pickle
import cloudpickle
from flask import Flask, request, jsonify  # Use Flask for the server
from flask_cors import CORS, cross_origin
from sklearn.metrics.pairwise import linear_kernel
import logging
import pandas as pd

# Load pickled model components
content_data = pd.read_csv("career_paths.csv")
# combining interests and skills
content_data['combined_features'] = content_data['Interest'] + ' ' + content_data['Skills']
vectorizer = pickle.load(open('vectorizer.pickle', 'rb'))
similarity_matrix = pickle.load(open('similarity_matrix.pickle', 'rb'))
# recommend_function = cloudpickle.load(open('recommendation_function.pickle', 'rb'))
tfidf_matrix = vectorizer.fit_transform(content_data['combined_features'])

def content_based_recommendation(user_profile, content_similarity_matrix, num_recommendations=2):
    print('starting function')
    user_vector = vectorizer.transform([user_profile])
    print(f'user vector: {user_vector}')
    scores = linear_kernel(user_vector, tfidf_matrix).flatten()
    print(f'scores: {scores}')
    # finding indices of top similarity scores
    top_field_indices = scores.argsort()[-num_recommendations:][::-1]
    recommended_fields = content_data['Field'].iloc[top_field_indices].to_list()
    print(f'recommended fields: {recommended_fields}')

    return recommended_fields


app = Flask(__name__)
app.debug = True
cors = CORS(app, resources={r"/recommendations": {"origins": "*"}})

# error handling
app.logger.setLevel(logging.WARNING)  # Set log level to INFO
handler = logging.FileHandler('app.log')  # Log to a file
app.logger.addHandler(handler)

@app.route('/recommendations', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorisation'])


def receive_skills():
  try:
    if request.method == 'POST':
      skills = request.json.get('skills') # Extract skills from data
      if skills:
        # Preprocess skills 
        processed_skills = ", ".join(skills)
        # user_vector = vectorizer.transform([processed_skills])
        print(processed_skills)
        recommendations = content_based_recommendation(processed_skills, similarity_matrix)
        response = jsonify(recommendations)
        print(response)
        # response.headers['Access-Control-Allow-Origin'] = '*'  # Allow all origins
        return response  # Return recommendations as JSON
      else:
        return jsonify({'error': 'No skills provided'}), 400  # Handle missing skills error
    else:
      return jsonify({'error': 'Invalid request method'}), 4
  except Exception as e:
    print("An error occurred:", e)
    app.logger.error("An error occurred: %s", e)
    return jsonify({'error': 'Internal server error'}), 500
  

if __name__ == '__main__':
   app.run(port=5000)
