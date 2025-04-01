from flask import Flask, render_template,jsonify, request, make_response, redirect, url_for
from ai import createRecipe
from ai2 import createRecipe2
import requests
import firebase_admin
from firebase_admin import credentials, db
from deep_translator import GoogleTranslator


cred = credentials.Certificate("chef-ai-firebase.json")





firebase_admin.initialize_app(cred, {
    'databaseURL': ''  # Replace with your database URL
})

# Firebase Auth API URL for creating a user
FIREBASE_SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY_HERE'

FIREBASE_SIGNIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY_HERE'





app = Flask(__name__)



data_storage = {}

def translate_to_malayalam(text):
  # Translate to Malayalam using GoogleTranslator
  translated_text = GoogleTranslator(source='en', target='ml').translate(text)
  return translated_text

@app.route('/save_data', methods=['POST'])
def save_data():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Extract id, htmlContent, and title from the JSON data
    id = data.get('id')
    html_content = data.get('htmlContent')
    title = data.get('title')  # New field for title
    
    # Save the data in the dictionary
    data_storage[id] = {'htmlContent': html_content, 'title': title}
    
    print(f"Saved data: {id} -> {title}: {html_content}")
    
    # Send a response back to the client
    return jsonify({"status": "success", "id": id, "title": title, "htmlContent": html_content})



@app.route('/get_favourites', methods=['GET'])
def get_favourites():
    # Return the saved favourites data as JSON
    return jsonify(data_storage)

@app.route('/get_favourite_details', methods=['GET'])
def get_favourite_details():
    # Get the 'id' from the query parameter
    favourite_id = request.args.get('id')

    # Fetch the favourite data from storage (e.g., from a dictionary or database)
    favourite = data_storage.get(favourite_id)

    if favourite:
        # Return the favourite details as JSON
        return jsonify(favourite)
    else:
        # Return a 404 or error message if the favourite doesn't exist
        return jsonify({"error": "Favourite not found"}), 404

@app.route('/favourite_details')
def favourite_details_page():
    return render_template('favourite_details.html')

@app.route('/delete_favourite/<id>', methods=['DELETE'])
def delete_favourite(id):
    try:
        id = int(id)  # Convert if needed
    except ValueError:
        pass  # Keep it as string if it fails

    if id in data_storage:
        del data_storage[id]
        return jsonify({"status": "success", "message": f"Favourite {id} deleted."}), 200
    else:
        return jsonify({"status": "error", "message": "Favourite not found."}), 404




@app.route('/remove_favourite', methods=['POST'])
def remove_favourite():
    data = request.get_json()
    id = data.get('id')
    
    if id in data_storage:
        del data_storage[id]
        return jsonify({"status": "success", "id": id})
    return jsonify({"status": "error", "message": "Favourite not found"})



@app.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Data to send to Firebase API
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }

    # Send POST request to Firebase Authentication API
    response = requests.post(FIREBASE_SIGNUP_URL, json=payload)
    data = response.json()

    if "error" in data:
        return jsonify({"error": data['error']['message']}), 400

    return jsonify({"message": "User signed up successfully!", "idToken": data['idToken']}), 201




@app.route('/signin', methods=['POST'])
def signin():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Data to send to Firebase API
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }

    # Send POST request to Firebase Authentication API
    response = requests.post(FIREBASE_SIGNIN_URL, json=payload)
    data = response.json()

    if "error" in data:
        return jsonify({"error": data['error']['message']}), 400

    return jsonify({"message": "User signed in successfully!", "idToken": data['idToken']}), 200




@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        # Predefined user data
        user_data = {
            'name': 'Sulaiman',
            'email': 'sulaiman@example.com',  # Example email
            'age': 25  # Example age
        }
        
        # Push user data to Realtime Database
        ref = db.reference('users')  # Reference to the 'users' node in Realtime Database
        new_user_ref = ref.push(user_data)  # Adds a new user entry
        
        return jsonify({"message": "User added successfully!", "user_id": new_user_ref.key}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400



@app.route('/')
def index_page():
    return render_template("index.html")


@app.route('/fav')
def fav_page():
    return render_template("fav.html")


@app.route('/home')
def home_page():
    language = request.cookies.get('language', 'English')
    return render_template("home.html", language=language)

@app.route('/recipe')
def recipe_page():
    return render_template("recipe.html")


@app.route('/login')
def login_page():
    return render_template("login.html")

@app.route('/generated')
def generated():
    language = request.args.get("language")
    food_time = request.args.get("foodTime")
    food_type = request.args.get("type")
    food_ingredients = request.args.get("foodIngredients")

    # Pass values to the template
    return render_template("generated.html", language=language, food_time=food_time, food_type=food_type, food_ingredients=food_ingredients)

@app.route('/generated2')
def generated2():
    language = request.args.get("language")
    foodName = request.args.get("foodName")

    # Pass values to the template
    return render_template("generated2.html", language=language, foodName=foodName)


@app.route("/generate-recipe", methods=["POST"])
def generate_recipe():
    try:
        # Get the language preference from the cookie
        language = request.cookies.get('language', 'English')
        
        data = request.json  # Parse the incoming JSON request
        ingredients = data.get("foodIngredients")
        food_type = data.get("type")
        time = data.get("foodTime")

        # Validate inputs
        if not ingredients or not food_type or not time:
            return jsonify({"error": "Missing required fields"}), 400

        # Call the createRecipe function
        recipe = createRecipe(language, ingredients, food_type, time)

        # Translate the recipe to Malayalam if the language is 'Malayalam'
        print(language)
        if language.lower() == "malayalam":
            print("translating to malayalam")
            recipe = translate_to_malayalam(recipe)
            

        return jsonify({"recipe": recipe})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/generate-recipe2", methods=["POST"])
def generate_recipe2():
    try:
        data = request.json  # Parse the incoming JSON request
        language = request.cookies.get('language', 'English')
        foodName = data.get("foodName")

        # Validate inputs
        if not foodName or not language:
            return jsonify({"error": "Missing required fields"}), 400

        # Call the createRecipe function
        recipe = createRecipe2(language, foodName)

        print(language)
        if language.lower() == "malayalam":
            print("translating to malayalam")
            recipe = translate_to_malayalam(recipe)

        return jsonify({"recipe": recipe})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/toggle_language')
def toggle_language():
    current_language = request.cookies.get('language', 'English')
    new_language = 'Malayalam' if current_language == 'English' else 'English'
    response = make_response(redirect(url_for('home_page')))
    response.set_cookie('language', new_language)
    return response

if __name__ == '__main__':
    app.run(debug=True)


