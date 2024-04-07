const http = require("http")

const server = http.createServer((req, res) => {
    if (req.url?.includes("/test")) {
        const decodedUrl = decodeURI(req.url.replace("/test", ""));
        res.writeHead(200, {
            "location": decodedUrl,
            "Content-Type": "text/plain"
        })

        res.end("Hello")
    } else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        })
        res.end("Not Found")
    }
})

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})


// 1. http://localhost:3000/test%20%0aSet%20Cookie:%20asd=qwe -> 这种情况，node 不会自动处理或解码导致安全问题的编码序列, 但会截断
// 2. 换行符或者特殊字符会被拦截
// 3. res 返回的时候，node http 会对 location, set-cookie, content-type 进行处理

