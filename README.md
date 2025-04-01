# MayoCaseStudy_GrayM
Hi My name is Gray McLaney and this is a basic Task Tracker web application built as part of the Mayo Clinic IT Intern case study.
 
The app allows users to add, update, and delete tasks, and includes both a simple frontend(js, html, css) and a Python backend using FastAPI.

Add new tasks (with name, description, and status)
- View tasks by status (Pending / Completed)
- Update task status via dropdown
- Delete tasks
- Auto-refreshes every 5 seconds
- Fully functional REST API (GET, POST, PUT, DELETE)


To Start Make Sure Python and Pip is correctly installed on your machine

Then open a new terminal or cmd in the file location and run this command
pip install fastapi uvicorn

To start the API run this command
uvicorn main:app --reload

After The Api is Running to make sure its working you should see this 
Uvicorn running on http://127.0.0.1:8000

Following that you can see The Swagger UI is available at: 
http://127.0.0.1:8000/docs

You can then right click index.html and click COPY PATH
- paste the link in your browser, and play around with the task tracker frontend 

🔍 How to Inspect the App
View Task Data in Browser
Right-click on the webpage and select Inspect.
Go to the Application tab (in Chrome).
You can observe frontend behavior here (though the actual task data lives in the backend).

🔍 View Task Data on the Server
After adding tasks via the form:
Navigate to http://127.0.0.1:8000/tasks/
You’ll see the live JSON of all current tasks.
Refresh the page to see updated API results.




