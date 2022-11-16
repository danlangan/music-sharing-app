// Spotify Generation

let express =require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')

let app = express()


let redirect_uri_login = 'http://localhost:8888/callback'
let client_id = 'fc41411f058f4c138544fe702e7ecc03'
let client_secret = 'cc91a30aee904fbf992156e53ee9831a'

app.use(cors())

app.get('/login', function(req, res){
    res.redirect('https://accounts.spotify.com/authroize?' + 
    stringify({
        response_type: 'code',
        client_id: client_id,
        scope: 'find this on your spotify api collection on postman',
        redirect_uri: redirect_uri_login
    }))
})

app.get('/callback', function(){
    let code = req.query.code || null
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        forms: {
            code: code,
            redirect_uri: redirect_uri_login,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic' + (Buffer.from(
                client_id + ':' + client_secret
            ).toString('base64'))
        },
        json: true
    }
    post(authOptions, function(error, response, body){
        var access_token = body.access_token
        let uri = process.env.FRONTEND_URI || 'http://localhost:3000/' // there likely needs to be a /media after this so it can access the django app media
        res.redirect(uri + '?access_token=' + access_token)
    })
})

// Apple Music Generation

const jwt = require('jsonwebtoken')
const fs = require('fs')

const private_key = fs.readFileSync('OAuth.p8').toString();
const team_id = 'A4NXNNBMQ6'
const key_id = 'Y8F8JV7CXD'

const token = jwt.sign({}, private_key, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: team_id,
    header: {
        alg: 'ES256',
        kid: key_id
    }
})

app.get('/token', function (req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({token: token}))
})

let port = 8888
console.log(`Listening on port ${port}. Go to /login to initiate authentication flow`)
app.listen(port)
