from openai import OpenAI
import os
from dotenv import load_dotenv

class GPTWrapper:
    model='gpt-4'

    def __init__(self) -> None:
        load_dotenv()
        self.client = OpenAI(api_key=os.environ['API_KEY'])

    def __system_prompt(self):
        return '\n'.join([
            "You are a events organizer bot. You can help you to organize events. Here are some rules:",
            "1. When asked to do add an event, say '1' and then your response."
            "2. When asked to do list all events, say '2' and then your response."
            "3. When asked to do delete an event, say '3' and then your response."
            "4. If the user tells you that wasn't what the wanted to do, say '4' and then your response."
        ])
    
    def generate(self, prompt: str, temperature: int = 1, seed: int = None):
        print(prompt)
        res = self.client.chat.completions.create(
            model=self.model,
            seed=seed,
            temperature=temperature,
            messages=[
                {"role": "system", "content": self.__system_prompt()},
                {"role": "user", "content": prompt}
            ]
        )
        print(f'Request resulted with using {res.usage.prompt_tokens} promt and {res.usage.completion_tokens} completion tokens.')
        return {
            "description": res.choices[0].message.content
        }
        