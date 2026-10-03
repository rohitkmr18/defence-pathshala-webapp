from pydantic import BaseModel
from typing import List, Optional, Union


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    target_year: Optional[Union[str, int]] = None
    target_exams: Optional[List[str]] = None
