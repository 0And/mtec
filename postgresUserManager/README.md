# Setting up the database
- Make sure to have postgresql installed. If you are using Homebrew on a Mac, type this into your terminal to install PostgreSQL CLI stuff: **brew install postgresql**
- Make sure PostgreSQL is running. If you are using Homebrew on a Mac for PostgreSQL, type this into your terminal: **brew services start postgresql**
- I used the automatically created postgres database to connect to my app. This was my URL for the app: **postgres://localhost:5432/postgres.** If you don't have a postgres database then make one or change the source code URL variable in /db/database.js on line 2 to use a different database. You can use **createdb postgres** to create the database.
- Type **psql postgres** to open the postgres database.
- Type **CREATE TABLE list (id INT PRIMARY KEY NOT NULL, obj text);** to create a relational table for the app to use.
- The database should be all set up and the server should be ready to launch. Type **\q** to exit the postgres database.

# How to launch
- Make sure you have node installed. Install node packages by typing: **npm i**
- Make sure PostgreSQL is running. If you are using Homebrew on a Mac for PostgreSQL, type this into your terminal: **brew services start postgresql**
- Open a terminal in the root folder and type **node app** or **npm start** to launch the server.
- Go on a browser to the URL "localhost:3000" to get to the app.
- control + c to stop the server.

# Hosted on Heroku: [glacial-atoll-93654](https://glacial-atoll-93654.herokuapp.com/)