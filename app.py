from flask import Flask, request, jsonify
from langchain.llms import OpenAI
import os

app = Flask(__name__)

# LangChain 및 OpenAI 설정
openai_api_key = os.getenv('OPENAI_API_KEY')
llm = OpenAI(api_key=openai_api_key)

class StringPromptTemplate:
    def __init__(self, template_str):
        self.template_str = template_str

    def format(self, input_text):
        return self.template_str.format(input=input_text)

prompt_template = StringPromptTemplate("Given the user input: '{input}', suggest a suitable web service structure and code.")

@app.route('/process', methods=['POST'])
def process_text():
    data = request.json
    text = data['text']
    response = llm.complete(prompt=prompt_template.format(input=text), max_tokens=50)  # Adjust max_tokens as needed
    html_content = response.choices[0].text
    return jsonify({"html": html_content})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6000))
    app.run(port=port)