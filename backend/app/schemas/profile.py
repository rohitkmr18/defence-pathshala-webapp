from pydantic import BaseModel
from typing import List


class ProfileUpdate(BaseModel):
    full_name: str
    target_year: str
    target_exams: List[str]