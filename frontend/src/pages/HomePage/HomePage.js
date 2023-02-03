import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Switch } from 'antd';
import axios from "axios";
// import { isExpired, decodeToken } from 'react-jwt'

const CLIENT_ID = 'fc41411f058f4c138544fe702e7ecc03' // spotify
const CLIENT_SECRET = 'cc91a30aee904fbf992156e53ee9831a' // spotify

const TEAM_ID = 'A4NXNNBMQ6' //apple music
const KEY_ID = 'Y8F8JV7CXD' //apple music

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  const [user, token] = useAuth();
  const [medias, setMedias] = useState([]);
  const [mediaInfo, setMediaInfo] = useState('');
  const [toggle, setToggle] = useState(true);
  const [appleMusicJwt, setAppleMusicJwt] = useState('');
  const [spotifyJwt, setSpotifyJwt] = useState('')

    //apple music jwt generation

    // const appleMusicJwt = require('jsonwebtoken');
    // const fs = require('fs');

      // const appleMusicPk = `-----BEGIN PRIVATE KEY-----
      // MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgPBVMHz6WCDdR5oUz
      // Jut5eksbQKzhzUKkPgv8oIPPCV2gCgYIKoZIzj0DAQehRANCAASJGjzP8wcHWtUK
      // epmIHhvZFG2ottaX6G//NYEZj+eXYzn4hi//w3ZMgmX1rT1Op/+kK3nwvxcRzshB
      // VbEK8OoY
      // -----END PRIVATE KEY-----`;

      // const generateAppleMusicJwt = async() => {
      //   const tokenAm = jwt.sign({
      //   iss: `${TEAM_ID}`,
      //   exp: Math.floor(Date.now() / 1000) + 86400 // expires in 24 hours
      //   }, appleMusicPk, {algorithm: 'ES265'})
      //   return tokenAm;
      // };

      // const appleMusicOptions = {
      //   algorithm: 'RS256',
      //   header: {
      //     alg: 'RS256',
      //     kid: `${KEY_ID}`
      //   }
      // };

      // const appleMusicToken = appleMusicJwt.sign(appleMusicPk, appleMusicOptions);
      // console.log(appleMusicToken);

      //spotify jwt generation

      // const spotifyJwt = require('jsonwebtoken');

      // const spotifyPrivateKey = `${CLIENT_SECRET}`;

      // const spotifyPayload = {
      //   iss: `${spotifyPrivateKey}`,
      //   exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
      //   iat: Math.floor(Date.now() / 1000),
      //   sub: `${CLIENT_ID}`,
      //   aud: 'https://api.spotify.com'
      // };

      // const spotifyOptions = {
      //   algorithm: 'RS256',
      //   header: {
      //     typ: 'JWT'
      //   }
      // };

      // const generateSpotifyJWT = () => {
      //   const clientId = `${CLIENT_ID}`;
      //   const clientSecret = `${CLIENT_SECRET}`;
      //   const payload = {
      //     iss: clientId,
      //     exp: Math.floor(Date.now() / 1000) + 3600 // expires in 1 hour
      //   };
      //   const token = jwt.sign(payload, clientSecret, { algorithm: "HS256" });
      //   return token;
      // };
    


  useEffect(() => {

    // generateSpotifyJWT().then(data => setSpotifyJwt(data))
    // generateAppleMusicJwt().then(data => setAppleMusicJwt(data))
    
    const fetchMedia = async () => {
      try {
        let response = await axios.get("http://127.0.0.1:8000/api/media/", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setMedias(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchMedia();
  }, [token]);


  function getMediaInfo() {
    if (toggle === true) {
    debugger;
    const splitUrlScoped = mediaInfo.split('/');
    let readyMediaType = ''
    let readyMediaId = ''
    selectMediaId(splitUrlScoped);
    selectMediatype(splitUrlScoped);
    function selectMediatype(splitUrlScoped) {
      if (splitUrlScoped[3] === 'track') {
        readyMediaType = 'tracks';
      } else if (splitUrlScoped[3] === 'album') {
        readyMediaType = 'albums';
      } else if (splitUrlScoped[3] === 'playlist') {
        readyMediaType = 'playlists'
      };
    };
    function selectMediaId(splitUrlScoped) {
      readyMediaId = splitUrlScoped[4];
    }
    fetchSpotifyMediaData(readyMediaType, readyMediaId); // will need to add the spotify access token in here 

    async function fetchSpotifyMediaData(readyMediaType, readyMediaId) {
      debugger;
      try{
        let response = await axios.get(`https://api.spotify.com/v1/${readyMediaType}/${readyMediaId}`); // will need to pass in the spotify access token eventually
        console.log(response.data)
        let spotifyDataReturn = response.data;
        getSpotifyApiData(spotifyDataReturn);
      } catch (error) {
        console.log(error.message);
      };

      function getSpotifyApiData(spotifyDataReturn) {
        if (readyMediaType === 'tracks') {
          let parsedSpotifyData = `'mediaName' : ${spotifyDataReturn.href}`
          queryAppleMusic(parsedSpotifyData);
      } else if (readyMediaType === 'playlists') {
          let parsedSpotifyData = `'mediaName' : ${spotifyDataReturn.href}`
          queryAppleMusic(parsedSpotifyData);
      } else if (readyMediaType === 'albums') {
          let parsedSpotifyData = `'mediaName' : ${spotifyDataReturn.href}`
          queryAppleMusic(parsedSpotifyData);
      };
      
    };
    async function queryAppleMusic(parsedSpotifyData) {
      try{
        let response = await axios.get(`https://api.music.apple.com/v1/me/library/search/${parsedSpotifyData.href.artists.name}+${parsedSpotifyData.href.name}`);
        let appleMusicDataReturn = response.data;
        console.log(response.data);
        console.log(appleMusicDataReturn);
      } catch (error) {
        console.log(error.message);
      };
    };
  }
  }
  else if (toggle === false) {
    debugger;
    const splitUrlScoped = mediaInfo.split('/');
    let readyMediaType = ''
    let readyMediaId = ''
    selectMediaId(splitUrlScoped);
    selectMediatype(splitUrlScoped);
    function selectMediatype(splitUrlScoped) {
      if (splitUrlScoped[4] === 'song') {
        readyMediaType = 'songs';
      } else if (splitUrlScoped[4] === 'album') {
        readyMediaType = 'albums';
      } else if (splitUrlScoped[4] === 'playlist') {
        readyMediaType = 'playlists'
      };
    };
    function selectMediaId(splitUrlScoped) {
      readyMediaId = splitUrlScoped[5];
    }
    fetchAppleMusicMediaData(readyMediaType, readyMediaId);

    async function fetchAppleMusicMediaData(readyMediaType, readyMediaId) {
      try{
        let response = await axios.get(`https://api.music.apple.com/v1/us/${readyMediaType}/${readyMediaId}`)
        console.log(response.data)
        let appleMusicDataReturn = response.data;
        console.log(appleMusicDataReturn);
        getAppleMusicApiData(appleMusicDataReturn);
      } catch (error) {
        console.log(error.message)
      }
    }
    function getAppleMusicApiData(appleMusicDataReturn) {
      if (readyMediaType === 'tracks') {
        let parsedAppleData = `'mediaName' : ${appleMusicDataReturn.href}`
        querySpotify(parsedAppleData);
    } else if (readyMediaType === 'playlists') {
        let parsedAppleData = `'mediaName' : ${appleMusicDataReturn.href}`
        querySpotify(parsedAppleData);
    } else if (readyMediaType === 'albums') {
        let parsedAppleData = `'mediaName' : ${appleMusicDataReturn.href}`
        querySpotify(parsedAppleData);
    };
  };
  async function querySpotify(parsedAppleData, splitUrlScoped) {
    try {
      let response = await axios.get(`https://api.spotify.com/v1/search?type=${splitUrlScoped[4]},${parsedAppleData.name}_${parsedAppleData.artists}`);
        console.log(response.data)
        let spotifyDataReturn = response.data;
        console.log(spotifyDataReturn);
    } catch (error) {
      console.log(error.message)
    }
  };

  }
  //this is where getMediaInfo() ends
  // there is lots of building out to do left in the code above but that is the overall structure as to how to know what dot notation to use to access certain information within the variables
  };

  function handleSubmit(event) {
    event.preventDefault();
    getMediaInfo(mediaInfo);
  }
  const spotifyOrApple = () => {
    toggle ? setToggle(false): setToggle(true);
  }

  return (
    <div className="container">
      <h1>Welcome home, {user.username}!</h1>
      <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></script>

      <meta name="apple-music-developer-token" content="DEVELOPER-TOKEN"/>
      <meta name="apple-music-app-name" content="My Cool Web App"/>
      <meta name="apple-music-app-build" content="1978.4.1"/>

      <form onSubmit={handleSubmit}>
        <div>
        <p>Toggle between sharing Spotify or an Apple Music Media</p>
        <Switch onClick={spotifyOrApple}/>
        {toggle ? <span>Spotify</span> : <span>Apple Music</span>}
        </div>
      <input placeholder='Paste sharing link here' value={mediaInfo} onChange={(event) => setMediaInfo(event.target.value)}></input>
      <button type='submit'>Generate Sharing Capability</button>
      </form>
      <h2>See your history of shared media below:</h2>
      <ul>
      {medias &&
        medias.map((media) => (
          <p key={media.id}>
            {media.track} {media.album} {media.playlist} {media.trackLink} {media.albumLink} {media.playlistLink} {media.appleMusic} {media.spotify}
          </p>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;


// var spotifyAuthParameters = {
    //   method : 'POST',
    //   headers : {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    // }
    // fetch('https://accounts.spotify.com/api/token', spotifyAuthParameters)
    // .then(result => result.json())
    // .then(data => setSpotifyAccessToken(data.access_token))

    // Apple Music API Access Token
    // var appleMusicAuthParameters = {
    //   method : 'POST',
    //   headers : {
    //     'Content-Type': 'application'
    //   }
    // }

    // async function spotifySearch() {
  //   // GET request using the search to get the artist ID
  //   var searchParameters = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + spotifyAccessToken
  //   }
  // }
  // var artistID = await fetch('https://api.spotify.com/v1/search?q=' + parsedSpotifyData + '&type=artist', searchParameters)
  //   .then(response => response.json())
  //   .then(data => { return data.artists.items[0].id })
  // console.log('The artist ID is' + artistID)
  // // Get request with Artist ID to grab all the albumbs from that artist
  // var albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
  // .then(response => response.json())
  // }
