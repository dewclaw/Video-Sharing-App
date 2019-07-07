let http = require('http')
let sConfig = require('./lib/config.js')
let Routes = require('./routes/routes.js')
let DBManager = require('./lib/DBManager')
let fs = require('fs')
let path = require('path')
let BodyBuilder = require('./lib/BodyBuilder.js')
let BodyParser = require('./lib/bodyparser.js')
// Connect to DB     
DBManager.DBConnect()
let index = fs.readFileSync('./html/index.html', 'utf8')
let videoTemplate = fs.readFileSync('./html/video.html', 'utf8')


let server = http.createServer((request, response) => {
    
    console.log(`INCOMING REQUEST: ${request.connection.remoteAddress} -----> ${request.method} -----> ${request.url}`)

    switch (request.url) {
        case '/':
            {
                response.writeHead(200, { 'Content-Type': 'text/html' })
                response.write(index)
                response.end()
            }
            break
        case '/showusers':
            {
                if (request.method == 'GET') {
                    Routes.getUsers(request, response, DBManager)
                } else if (request.method == 'POST') {
                    response.end("SEND INFO TO BE CREATED")
                }
            }
            break
        case '/video':
            {
                // const src = fs.createReadStream('./videolib/video0.mp4')
                // response.write(videoTemplate)
                // src.pipe(response)
                fs.stat('./videolib/video0.mp4', (error, stats) => {
                    if (error) {
                        if (error.code === 'ENOENT') {
                            return response.statusCode(404).send()
                        }
                    }
                    var start;
                    var end;
                    var total = 0;
                    var contentRange = false;
                    var contentLength = 0;

                    var range = request.headers.range;
                    if (range) {
                        var positions = range.replace(/bytes=/, "").split("-");
                        start = parseInt(positions[0], 10);
                        total = stats.size;
                        end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                        var chunksize = (end - start) + 1;                        // Look more into this
                        contentRange = true
                        contentLength = chunksize
                    }
                    else {
                        start = 0
                        end = stats.size
                        contentLength = stats.size
                    }
                    if (start <= end) {
                        var responseCode = 200;
                        var responseHeader = {
                            "Accept-Ranges": "bytes",
                            "Content-Length": contentLength,
                            "Content-Type": "video/mp4"
                        }
                        if (contentRange) {
                            responseCode = 206;
                            responseHeader["Content-Range"] = "bytes " + start + "-" + end + "/" + total;
                        }
                        response.writeHead(responseCode, responseHeader)
                        var stream = fs.createReadStream('./videolib/video0.mp4', { start: start, end: end })
                            .on("readable", () => {
                                var chunk;
                                while (null !== (chunk = stream.read(1024))) {
                                    response.write(chunk);
                                }
                            }).on("error", (err) => {
                                response.end(err);
                            }).on("end", (err) => {
                                response.end();
                            });
                    }
                    else {
                        return response.status(403).send();
                    }

                })

            }
            break
        case '/upload':
            {
                if (request.method == 'POST') {

                    headerBoundryObj = BodyParser.formHeaderParser(request.headers)

                    // console.log(headerBoundryObj)
                    let contentType = request.headers["content-type"]

                    BodyBuilder.bodyParser(request).then((body) => {
                        // console.log(request.headers)
                        // console.log(body)

                        BodyBuilder.searchBody(body,headerBoundryObj);


                        // console.log(contentType)
                        if(contentType.includes("multipart/form-data; boundary=")){
                            // console.log("Message is a multipart/form-data")
                            // fs.writeFile('writtenBody', body, (error)=>{
                            //     if (error) throw error;
                            //     console.log("File Written")
                            // })




                        }
                        response.end("RESPONSE")
                    })

                }
            }
            break
        default:
            response.end("No route defined")
    }
}).listen(sConfig.serverConfig.port, sConfig.serverConfig.location, () => {
    console.log(`Server is running on ${sConfig.serverConfig.location}:${sConfig.serverConfig.port}`)
})