# Infinity Entertainment Web App

## Developed by Francisco Ceballos as a final proyect for CoderHouse BackEnd Course

The goal of this project was to learn how to create a NodeJs server using Express in the NodeJs environment.
It emulates a movies and series store. MongoDB is used as database and there are 3 levels of authorization: not logged in, logged in, admin.
When you are logged in you can add and delete items in your cart, make an order and ask questions in the live chat. The admin can add, edit and delete items from the catalog, and also answer questions from the chat.
The frontend is implemented using ejs template engine. For data input validation you get feedback in the UI. You can also reset your password from the login page.

Tools (dependencies) that where learned and used:

- bcryptjs: for hashing passwords.
- express-session and connect-mongodb-session: for creating sessions.
- express-validator: for validating data input in forms.
- ejs: as a template engine.
- mongoose: for implementing a mongodb database.
- socket.io: for creating a live Q&A chat.
- multer: for uploading image files.
- helmet: for seguring requests.
- nodemailer: for sending emails with SendGrid and Twilio.
- dotenv: for creating environment variables in development.
- pino: for logs in development.
- csurf: for CSRF protection (package used is deprecated right now).

Things I plan on implementing:

- React in front end.
- Simulate payments.
- Testing units.
- Update CSRF protection with new npm package.
