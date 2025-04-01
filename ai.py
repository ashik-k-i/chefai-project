import os
import google.generativeai as genai

# Configure the API key for Google Gemini
genai.configure(api_key="AIzaSyCZ0_WCAq0IqFSe537mELe10LJIJjiJ6GM")

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



















"""

import json

from llamaapi import LlamaAPI
# Initialize the SDK
llama = LlamaAPI("LA-8cacffcd8f1049a0a48cf4e2991c15b196d5ec0522d146379e5543af1532bc49")

input_txt = '''Food Type : Kerala
Ingrediants : bread , egg, salt.
Time : 5 Minuts'''

# Build the API request
api_request_json = {
    "model": "llama3.1-70b",
    "messages": [
        {"role": "system", "content": "You are a chef ai named Chefai. you will generate recipe based on the ingrediants and time and food type. and send only the detailed Step by step to make that recipe as output"},
        {"role": "user", "content": input_txt},
    ],
    "stream": False,
    "max_tokens": 1024,
    "temperature": 0.9,
    "top_p": 1.0,
}

# Execute the Request
response = llama.run(api_request_json)

try:
    response_json = response.json()
    if "choices" in response_json and response_json["choices"]:
        message_content = response_json["choices"][0]["message"]["content"]
        print(message_content)
    else:
        print("Error")
except Exception as e:
    print("Error")


"""
