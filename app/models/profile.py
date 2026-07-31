from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class UserProfile(BaseModel):
    model_config = ConfigDict(json_schema_extra={"example": {}})
    """Kullanıcı profili verisini temsil eder."""

    name: str | None = None
    age: int | None = None
    city: str | None = None
    university: str | None = None
    department: str | None = None
    interests: list[str] = Field(default_factory=list)
    hobbies: list[str] = Field(default_factory=list)
    personality_traits: list[str] = Field(default_factory=list)
    goals: list[str] = Field(default_factory=list)
    likes: list[str] = Field(default_factory=list)
    dislikes: list[str] = Field(default_factory=list)
    technical_skills: list[str] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    experiences: list[str] = Field(default_factory=list)
    communication_style: str | None = None
    learning_style: str | None = None
    strengths: list[str] = Field(default_factory=list)
    areas_to_improve: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
