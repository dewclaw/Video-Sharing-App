function formHeaderParser(headers) {
    let contentType = headers["content-type"]
    let returnObject = {
        header1: "",
        boundry: "",
        boundryBegin : "",
        boundryEnd : ""
    }
    if (contentType.includes("multipart/form-data; boundary=")) {
        let headerSplit = contentType.split(" ")
        returnObject.header1 = headerSplit[0]
        let fullBoundryArray = headerSplit[1].split("")
        var tempArr = []
        for (var i = 0; i < fullBoundryArray.length; i++) {
            if(fullBoundryArray[i] === '-'){
                returnObject.boundry = fullBoundryArray.splice(i, fullBoundryArray.length).join('')
                returnObject.boundryBegin = `--${returnObject.boundry}`
                returnObject.boundryEnd = `--${returnObject.boundry}--`
                break
            }
        }

    }
    return returnObject
}

module.exports={
    formHeaderParser:formHeaderParser
}

// let contentType = 'multipart/form-data; boundary=----WebKitFormBoundaryq1xmvNmfNh2ZyEPx'


// let cTypeSplit = contentType.split(" ")
// var headerCType = cTypeSplit[0]
// var boundryArr = cTypeSplit[1].split("")



// function getBoundry(boundryArr) {
//     var tempArr = [];
//     for (var i = 0; i < boundryArr.length; i++) {
//         if (boundryArr[i] === '-') {
//             // console.log(boundryArr[i])
//             tempArr = boundryArr.slice(i, boundryArr.length)
//             break
//         }
//     }

//     return tempArr.join('')
// }
// let boundry = getBoundry(boundryArr)
// console.log(boundry)
// console.log(headerCType)
// console.log(boundryArr)