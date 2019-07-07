
function getUsers(request,response, DBManager){
    console.log("GET USERS CALLED")
    DBManager.UserModel.find((error,users)=>{
        if(error){
            throw error
        }
        response.end(JSON.stringify(users))
    })
    
}

module.exports = {
    getUsers : getUsers
}