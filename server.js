const express = require("express");
const app = express();
const dotEnv = require("dotenv").config(); //required to use dotenv
const cors = require("cors");
const db = require("./models"); //This creates db variable to do database queries w/ sequelize
const encryptPassword = require("./encryption"); //This is for the bcryptjs we installed. Check out the encryption.js file to see the snippet of code to make this work

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


/*
DON'T FORGET !!!!
    ON MIGRATION FILE(S) W/ PASSWORDS ADD--> const encryptPassword = require('../encryption');
 */



//    ALLOW USER TO REGISTER
app.post("/api/register", (req, res) => {
  db.user.findAll({ where: { email: req.body.email } }).then((users) => {
    if (users.length == 0) {
      if(req.body.password !== req.body.confirm_pw) {
        res.json({message: "Passwords do not match. Please try again."});
        return;
      } else {
        db.user.create({
            firstName: req.body.firstName, //White text is name of corresponding column in database. Orange text is name of key for the body in fetch request on Register.js file
            lastName: req.body.lastName,
            email: req.body.email,
            password: encryptPassword(req.body.password),
        })
          .then((data) => {
            console.log(data);
            res.status(201).json({ message: "Registration Successful!", registered: true });
          });
      }
    } else {
      res.status(409).json({
          message: "User already exists with this email. If you have forgotten your password, please reset it on the login page.",
          registered: false,
        });
      return;
    }
  });
});




//     ALLOW USER TO LOGIN
app.post("/api/login", (req, res) => {
  db.user.findAll({ where: { email: req.body.email } }).then((users) => {
    if (users.length == 0) {
      res.status(404).json({ 
        message: "User does not exist. Please visit the Registration page to create an account.", 
        login: false 
      });
      return;
    } else {
      let foundUser = users[0]; 
        /*
        Why users[0] ?
          I just chose to name the variable foundUser. It's set equal to the 1st index of 
          the variable that's returned in my db.user.findAll(blah).then(users)
          This is bc my user is kind of "buried" in the data returned to me, so
          I need to get it from the 1st index in order to access user details
        */ 
      //console.log(user.id);

      let encrypted_password = encryptPassword(req.body.password);

      if (foundUser.password === encrypted_password) {//Here, users.password is pulling from your user table in the database. Column name is password
        res.json({ login: true, user: { id: foundUser.id, fname: foundUser.firstName, email: foundUser.email }  });
      } else {
        res.status(409).json({ 
          message: "Wrong password entered. If you have forgotten your password, please click 'Forgot Password' above.", 
          login: false 
        });
      }
    }
  });
});




//      ALLOW USER TO RESET PASSWORD 
app.put("/api/resetPassword", (req, res) => {
  db.user.findAll({ where: { email: req.body.email } }).then((users) => {
    if (users.length == 0) {
      res.json({
        message: "User does not exist. Please visit the Registration page to create an account.",
        resetPW: false
      });
      return;
    }
    if(users) {
      if(req.body.password !== req.body.confirm_pw) {
        res.json({
          message: "Passwords do not match. Please try again.", 
          resetPW: false
        });
        return;
      } else {
        db.user.update({
          password: encryptPassword(req.body.password)}, //White text is name of corresponding column in database. Orange text is name of key for the body in fetch request on Register.js file
          {where: {email: req.body.email}}
        )
          .then((data) => {
            console.log(data);
            res.status(201).json({ 
              message: "Password successfully reset! You may now login with your updated password.", 
              resetPW: true });
          });
        }
    } 
  })
});





app.delete("/users", (req, res) => {
  console.log("Testing DELETE 123");
  res.json({});
});



// The app.listen Used w/ Heroku Deployment
app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port ${process.env.PORT || "3001"}`);
});


/* 
The "Normal" app.listen Used w/o Heroku Deployment
    app.listen(3001, () => {
        console.log('Listening on port 3001')
    }) 
*/
