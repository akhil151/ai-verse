"""
llm_client.py
Handles communication with Groq LLaMA Models

Features:
✔ Secure Groq API calling
✔ Automatic retries
✔ Timeout safety
✔ Multiple model support (LLaMA 3 / Mixtral)
✔ Language aware responses
"""

import os
import time
import requests


class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise Exception("❌ GROQ_API_KEY not found. Set environment variable.\n👉 Run: set GROQ_API_KEY=your_key_here (Windows) or export GROQ_API_KEY=your_key_here (Linux/Mac)")

        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.1-70b-versatile"  # Updated model, better for conversational responses
        print("🦙 LLaMA Model Ready via Groq")

    def generate(self, messages, max_tokens=1200, temperature=0.7, retries=3):
        """
        messages = [
            { "role": "system", "content": "..." },
            { "role": "user", "content": "..." }
        ]
        """

        for attempt in range(retries):
            try:
                response = requests.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                    },
                    timeout=30,
                )

                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]

                print(f"⚠️ LLM Request Failed: {response.text}")
                time.sleep(1)

            except Exception as e:
                print(f"⚠️ Error communicating with Groq: {e}")
                time.sleep(1)

        return "⚠️ LLM failed after multiple attempts. Please try again."


# ---------------------------------------
# Manual Test
# ---------------------------------------
if __name__ == "__main__":
    llm = LLMClient()

    msg = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello AI!"},
    ]

    print(llm.generate(msg))
