var bcrypt = require("bcrypt");
var models = require("../models");
var jwt = require("../utils/jwt.util")

//Routes
module.exports = {
    register: (req,res)=>{

        var email    =     req.body.email;
        var username =     req.body.username;
        var password =     req.body.password;
        var bio      =     req.body.bio;

        console.log(email +" "+ username +" "+ password +" "+ bio)

        if (email == null || username == null || password == null){
            return res.status(400).json({'error':'missing parameters'});
        }

        // TODO verfify
        models.User.findOne({
            attributes: ['email'],
            where:  {email:email}
        })
        .then((userFound)=>{
            if (!userFound){

                bcrypt.hash(password,5,(err,bcryptedPassword)=>{
                    var newUser = models.User.create({
                            email:email,
                            username:username,
                            password:bcryptedPassword,
                            bio:bio,
                            isAdmin:0
                        }).then((newUser)=>{
                            return res.status(201).json({
                                'userId': newUser.id
                            })
                    }).catch((err)=>{
                        return res.status(500).json({"error":"Cannot add user"});
                    });
                })

            }else{
                return res.status(409).json({ "error":"user already exist" });
            }

        })
        .catch((err)=>{
            return res.status(500).json({'error':"unable to verify user"});
        })
    },
    login: (req,res)=>{


        var email = req.body.email
        var password = req.body.password

        console.log(email +" " +password)

        if (email == null || password == null){
            return res.status(400).json({"error":"missing parameters"})
        }

        models.User.findOne({
            where:{email:email}
        })
        .then(function(userFound){
            if (userFound){
                bcrypt.compare(password,userFound.password,function(error,encrypted){
                    if (encrypted){
                        return res.status(201).json({
                            "user": userFound.id,
                            "token": jwt.generateWebToken(userFound)
                        })
                    }else
                    {
                        return res.status(404).json({"error":"password wrong"})
                    }
                })
            }else 
            {
                return res.status(403).json({"error":"User not found"})
            }
        })
        .catch(function(){
            res.status(500).json({"error":"Unable to find user"})
        })
    },
    getUserData: (req,res) => {

        var headersAuth = req.headers["authorization"]
        console.log("Autorisation : "+headersAuth);
        var userId = jwt.getUserId(headersAuth);

        if (userId<0){
            return res.status(400).json({"error":"Wrong token"});
        }

        models.User.findOne({
            attributes: ["id","email","username","bio"],
            where: { id : userId }
        })
        .then((user)=>{
            if (user){
                return res.status(201).json(user)
            }else{
                return res.status(400).json({"error":"User not found"})
            }
        })
        .catch((error)=>{
            return res.status(500).json({"error":"Unable to find user"})
        })

    }

}