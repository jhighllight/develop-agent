from langchain.agents import LLMSingleActionAgent
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import StringPromptTemplate
    
class LangchainAgent:
    def __init__(self):
        self.llm = OpenAI(temperature=0.7)
        self.prompt_template = StringPromptTemplate("Given the user input: '{input}', suggest a suitable web service structure and code.")
        self.llm_chain = LLMChain(llm=self.llm, prompt=self.prompt_template)
        self.agent = LLMSingleActionAgent(llm=self.llm_chain, stop=["\n"])

    def process(self, text):
        # Langchain 에이전트를 사용하여 사용자의 텍스트를 기반으로 웹 서비스 구조와 코드를 제안합니다.
        response = self.agent.run(input=text)
        return response