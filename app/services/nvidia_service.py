from openai import OpenAI

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class NvidiaService:

   def __init__(self):

    self.api_key = settings.nvidia_api_key
    self.model = settings.nvidia_model

    self.client = OpenAI(
        api_key=self.api_key,
        base_url="https://integrate.api.nvidia.com/v1"
    )

   def generate_response(self, prompt: str):

    response = self.client.chat.completions.create(

        model=self.model,

        messages=[
              {
        "role":"system",
        "content":"Sen EsraGPT isimli kişisel yapay zeka asistanısın."
    },
    {
        "role":"user",
        "content":prompt
    }
        ]

    )

    return response.choices[0].message.content