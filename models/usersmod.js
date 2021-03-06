const connection = require('../db/connection')

exports.selectUser = (username) => {
    return connection
    .first('*')
    .from('users')
    .where('username', '=', username)
    .then(user => {
        if(!user){
            return Promise.reject ( {
                status : 404,
                msg : `User '${username}' does not exist!`
            })
        } else return user
    })
}