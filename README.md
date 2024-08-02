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

5. Setup backend packages:
   a. Install pip if not already installed
   
   b. Run the following commands to install the python dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```
   
How to run the project:

Frontend:
```
cd frontend
pnpm run dev
```

Backend:
```
cd backend
python app.py
```

   
