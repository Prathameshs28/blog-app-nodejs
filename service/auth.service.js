const jwt = require('jsonwebtoken');

const secret = 'xiul4ml82hd2ldi9ej';

function createTokenForUser(user){
const payload = {
    _id:user._id,
    email:user.email,
    profileImgeUrl:user.profileImgageUrl,
    role:user.role,
    name:user.fullName
}

const token = jwt.sign(payload,secret);

return token;
}


function validateToken(token){
    const paylod = jwt.verify(token,secret);

    return paylod;
}

module.exports = {
    createTokenForUser,
    validateToken
}