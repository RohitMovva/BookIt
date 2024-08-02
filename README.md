# BookIt
How to setup:
1. Accept invitation to repo
2. Clone repo
   
   a. Open terminal in directory you want the repo directory to be located (e.x. Projects)
   
   b. git clone https://github.com/RohitMovva/BookIt.git
   
4. Setup frontend packages
   
   a. Open terminal in the directory (ctrl` in vscode)
   
   b. Install npm
   
   c. Run the following command to setup pnpm:

   ```
   npm install -g pnpm
   ```

   d. Setup the pnpm project:
   ```
   cd frontend
   pnpm i
   ```

6. Setup backend packages:
   
   a. Install python if not already installed

   b. Install virtualenv
   ```
   pip install virtualenv
   ```

   c. Create virtual environment
   ```
   cd /path/to/your/project
   cd flask-backend

   virtualenv env
   ```
   
   
How to run the project:

Frontend:

1. cd into the frontend folder
   ```
   cd frontend
   ```

2. Run the frontend
   ```
   pnpm run dev
   ```

Backend:

1. cd into the backend folder:
   ```
   cd flask-backend
   ```

2. Activate virtual environment:
   
   Windows:
   ```
   .\env\Scripts\activate
   ```
   Linux:
   ```
   source env/bin/activate
   ```

3. Install dependencies if you haven't previously:
   ```
   pip install -r requirements.txt
   ```

4. Run app
   ```
   export FLASK_APP=app.py
   export FLASK_ENV=development
   flask run
   ```
