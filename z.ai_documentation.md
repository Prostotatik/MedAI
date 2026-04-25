Python

JavaScript

cURL
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.ilmu.ai/v1",
)

response = client.chat.completions.create(
    model="ilmu-glm-5.1",
    messages=[
        {"role": "user", "content": "Write a Python function that reverses a linked list."}
    ],
)

print(response.choices[0].message.content)
​
Expected response
A successful call returns a standard OpenAI-compatible response:
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1712198400,
  "model": "ilmu-glm-5.1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "def reverse_linked_list(head):\n    prev = None\n    current = head\n    while current:\n        next_node = current.next\n        current.next = prev\n        prev = current\n        current = next_node\n    return prev"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 54,
    "total_tokens": 72
  }
}

Parameter	Type	Description
response_format	object	Set to {"type": "json_object"} to enable JSON mode.
All other chat completion parameters (model, messages, temperature, etc.) work as usual.
​
Basic example

Python

JavaScript

cURL
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.ilmu.ai/v1",
)

response = client.chat.completions.create(
    model="ilmu-glm-5.1",
    messages=[
        {
            "role": "system",
            "content": "Extract the requested information and return it as JSON.",
        },
        {
            "role": "user",
            "content": "Extract the name, language, and purpose from this: FastAPI is a modern Python web framework for building APIs.",
        },
    ],
    response_format={"type": "json_object"},
)

print(response.choices[0].message.content)
# {"name": "FastAPI", "language": "Python", "purpose": "building APIs"}
​
Extracting structured data
For reliable extraction, describe the exact schema you expect in your system prompt. The model will conform to the structure you specify.

Python

JavaScript

cURL
import json
import re
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.ilmu.ai/v1",
)

response = client.chat.completions.create(
    model="ilmu-glm-5.1",
    messages=[
        {
            "role": "system",
            "content": """Extract product information and return JSON with this exact schema:
{
  "products": [
    {
      "name": "string",
      "price_myr": number,
      "category": "string",
      "in_stock": boolean
    }
  ]
}""",
        },
        {
            "role": "user",
            "content": "We have the Logitech MX Master 3S mouse for RM 459, currently in stock under peripherals. The Keychron Q1 keyboard is RM 699 in keyboards, but out of stock.",
        },
    ],
    response_format={"type": "json_object"},
    temperature=0,
)

raw = response.choices[0].message.content
clean = re.sub(r"^```(?:json)?\n|```$", "", raw.strip())
data = json.loads(clean)

for product in data["products"]:
    status = "available" if product["in_stock"] else "out of stock"
    print(f"{product['name']}: RM {product['price_myr']} ({status})")
​
Response
{
  "products": [
    {
      "name": "Logitech MX Master 3S",
      "price_myr": 459,
      "category": "peripherals",
      "in_stock": true
    },
    {
      "name": "Keychron Q1",
      "price_myr": 699,
      "category": "keyboards",
      "in_stock": false
    }
  ]
}