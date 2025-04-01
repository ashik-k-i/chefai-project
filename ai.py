import os
import google.generativeai as genai

# Configure the API key for Google Gemini
genai.configure(api_key="")

# Create the model with the configuration parameters
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the model for recipe generation
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="You are a chef ai named Chef ai. You will generate a recipe based on the ingredients, time, and food type. Provide only the detailed step-by-step instructions with heading and sub headings for making the recipe. and add a main heading at first and dont add extra paragraph on first. and send multiple recipe in that format.",
)

# Create the chat session with the system and user instructions
chat_session = model.start_chat(
    history=[
        
    ]
)

# Function to generate the recipe based on user input
def createRecipe(language, ingredients, food_type, time):
    # Format the user input into a request message
    input_txt = f'''Food Type: {food_type}.
Ingredients: {ingredients}.
Time: {time}'''

    # Send the formatted input to the chat session
    response = chat_session.send_message(input_txt)
    
    # Return the response text from the AI model
    return response.text


















