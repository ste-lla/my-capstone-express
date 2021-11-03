const express = require('express');
const app = express();
const dotEnv = require('dotenv').config(); //required to use dotenv
const cors = require('cors');
const db = require('./models'); //This creates db variable to do database queries w/ sequelize
const encryptPassword = require('./encryption'); //This is for the bcryptjs we installed. Check out the encryption.js file to see the snippet of code to make this work

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors());

/*
DON'T FORGET !!!!
    ON MIGRATION FILE(S) W/ PASSWORDS ADD--> const encryptPassword = require('../encryption');
 */



app.get('/users', (req, res) => {
    console.log('Testing GET 123');
    res.json({})
})



//    ALLOW USER TO REGISTER
app.post('/api/register', (req, res) => {
    //console.log('Testing POST 123');
    db.user.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: encryptPassword(req.body.password)
    }).then((data) => {
        console.log(data);
        res.json({});
    })
});



//     ALLOW USER TO LOGIN
app.post('/api/login', (req, res) => {
    db.user.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        let encrypted_password = encryptPassword(req.body.password);
        
        if (user.password == encrypted_password) {  //Here, user.password is pulling from your database. You named your column password
          res.json({ login: true });
        } else {
          res.json({ login: false });
        }
      } else {
        res.json({ login: false })
      }
    })
  });

      
    

app.put('/users', (req, res) => {
    console.log('Testing PUT 123');
    res.json({})
})

app.delete('/users', (req, res) => {
    console.log('Testing DELETE 123');
    res.json({})   
})








app.listen(3001, () => {
    console.log('Listening on port 3001')
  })
