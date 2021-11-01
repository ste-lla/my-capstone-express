var bcrypt = require('bcryptjs');
var salt = "$2a$10$S7reL4c92HWR3a7fEu6W9e";

const encryptPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

module.exports = encryptPassword


/* 

EXPLANATIONS

  What is Salt?
    Salt is just the randomly generated unique characters that get added 
    in front of the user password (or whatever data) you are trying to
    encrypt. The salt is always changing each time. See lecture video
    from 10.2.21 @21:50 to see an example of this in the console
    
    We need to know what the salt is bc if we ever need to decrypt 
    our own data, if the salt is different each time, this would make
    it difficult for us to do

*/