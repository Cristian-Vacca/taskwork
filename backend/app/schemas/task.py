from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    priority: str | None = "media"
    due_date: str | None = None
    due_time: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    priority: str | None = None
    due_date: str | None = None
    due_time: str | None = None

class TaskResponse(TaskBase):
    id: int
    completed: bool
    owner_id: int

    class Config:
        from_attributes = True