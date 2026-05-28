const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");

module.exports.checkEmailExists = (req, res) => {

    if(req.body.email.includes("@")){

        // The result is sent back to the client via the "then" method found in the route file
        return User.find({ email : req.body.email })
        .then(result => {

            // The "find" method returns a record if a match is found
            if (result.length > 0) {

                return res.status(409).send({ message: "Duplicate email found" });


            // No duplicate email found
            // The user is not yet registered in the database
            } else {

                return res.status(200).send({ message: "No duplicate email found" });

            };
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        res.status(400).send({ message: 'Invalid email format' });
    }
};

module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send(false);
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send(false);
    // If all needed requirements are achieved
    } else {

        let newUser = new User({
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).json({ message: "Registered Successfully"}))
        .catch(error => errorHandler(error, req, res));
        
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {  

        return User.findOne({ email: req.body.email })
        .then(result => {


            if(result == null) {

                return res.status(404).send(false);
            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if(isPasswordCorrect) {
                    console.log(isPasswordCorrect)
                    return res.status(200).send({ access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send(false);
                }
            }
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        return res.status(400).send(false);
    }
}