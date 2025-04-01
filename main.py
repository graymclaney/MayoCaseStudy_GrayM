from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# In-memory task storage
TASK_STORE: Dict[int, dict] = {}
TASK_ID = 1  # Global counter for task IDs


class Task(BaseModel):
    name: str
    description: str
    status: str = "Pending"


@app.post("/tasks/", response_model=Dict[str, str | int])
def create_task(task: Task):
    """Creates a new task and returns the stored task with its ID."""
    global TASK_ID
    TASK_STORE[TASK_ID] = task.model_dump() 
    TASK_STORE[TASK_ID]["id"] = TASK_ID
    TASK_ID += 1
    return TASK_STORE[TASK_ID - 1]


@app.get("/tasks/", response_model=List[dict])
def get_all_tasks():
    """Returns all stored tasks."""
    return list(TASK_STORE.values())


@app.put("/tasks/{task_id}", response_model=Dict[str, str | int])
def update_task(task_id: int, updated_task: Task):
    """Updates an existing task by ID."""
    if task_id not in TASK_STORE:
        raise HTTPException(status_code=404, detail="Task not found")
    
    TASK_STORE[task_id].update(updated_task.model_dump())
    return TASK_STORE[task_id]


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """Deletes a task by ID."""
    if task_id not in TASK_STORE:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del TASK_STORE[task_id]
    return {"message": "Task deleted successfully"}
