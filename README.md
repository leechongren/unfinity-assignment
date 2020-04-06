# Ufinity Assignment

### Description

The objective of this API is to facilitate teachers with:

- Registering students under his/her name
- Retrieve students who belongs under all the teachers of interest
- Suspend a student
- Send out notifications to students under him/her and those that are @ mentioned

### Stack Used

- Express
- Node v13.5.0
- MySQL

### Packages used

- express: 4.17.1
- mysql2: 2.1.0,
- sequelize: 5.21.5

### git clone onto local drive

git clone https://github.com/leechongren/unfinity-assignment.git

### npm install

Use npm install to install the relevant packages in the NodeJS environment

### npm start

Runs the app in the local environment
Open http://localhost:3000 to view it in the browser.

### connecting to database

Please open up the sequelize.js file under utils folder
In there you will see the portion

```
const sequelize = new Sequelize("<SchemaName>", "<username>", "<password>", {
  host: "localhost",
  dialect: "mysql",
});
```

Please insert the relevant SchemaName, Username and Password from your local instance.

#### Routes

```
"POST /register",
"GET /commonstudents",
"POST /suspend",
"POST /retrievefornotifications"
```
