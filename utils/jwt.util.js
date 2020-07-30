// Imports
var jwt = require("jsonwebtoken")
const JWT_SIGN_SECRET = "qdqbjhdbqdjdfv76jfvqdjvf76jfvdjsqvf87dvqhsvdhqI"

module.exports = {
    generateWebToken : function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        }
        )
    },
    parseAuthorization: function(Authorization){
        return Authorization ? Authorization.replace("Baerer ","") :null 
    },
    // Get User Id.
    getUserId: function(Authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(Authorization);
        if (token !== null) {
            try{
                var JWT = jwt.verify(token,JWT_SIGN_SECRET);
                if (JWT !== null){
                    userId = JWT.userId;
                }
            }catch(error){}
        }

        return userId;
    }
}