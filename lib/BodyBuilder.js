
let queryString = require('querystring')

function bodyParser(request) {
    let body = []
    return new Promise((resolve, reject) => {
        try {
            request.on('error', (error) => {
                reject(error)
            }).on('data', (chunk) => {
                body.push(chunk)
            }).on('end', () => {
                body = Buffer.concat(body).toString()
                resolve(body)
            })
        } catch (err) {
            reject(err)
        }

    })
}
function searchBody(body, headerObject) {
    let arrayOfInput = []
    let searchTerm = headerObject.boundryBegin
    var indexOfFirst = body.indexOf(searchTerm)
    while (indexOfFirst != -1) {

        var indexOfSecond = body.indexOf(searchTerm, (indexOfFirst + 1))
        bodySegment = body.slice(indexOfFirst, indexOfSecond)
        arrayOfInput.push(bodySegment)
        indexOfFirst = indexOfSecond
    }
    for(var i = 0; i < arrayOfInput.length; i++){
        if(i == arrayOfInput.length - 1){
            arrayOfInput[i] = arrayOfInput[i].replace(headerObject.boundryEnd/headerObject.boundryBegin, "")
        } else {
            arrayOfInput[i] = arrayOfInput[i].replace(headerObject.boundryBegin, "")
        }

    }


    // var bodySlice = body.slice(indexOfFirst, indexOfSecond)
    // console.log(body)
    // console.log(indexOfFirst)
    // console.log(indexOfSecond)
    // console.log("LINE BREAK \n \n ")
    // console.log(bodySlice)
    console.log(arrayOfInput[1])
}
module.exports = {
    bodyParser: bodyParser,
    searchBody: searchBody
}