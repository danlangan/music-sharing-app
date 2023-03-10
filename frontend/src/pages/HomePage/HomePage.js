import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Switch } from 'antd';
import axios from "axios";

const CLIENT_ID = "fc41411f058f4c138544fe702e7ecc03"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  const [user, token] = useAuth();
  const [medias, setMedias] = useState([]);
  const [mediaInfo, setMediaInfo] = useState('');
  const [toggle, setToggle] = useState(true);
  const [spotifyToken, setSpotifyToken] = useState('')


  useEffect(() => {
    const hash = window.location.hash
    let spotifyToken = window.localStorage.getItem("token")

    if (!spotifyToken && hash) {
        spotifyToken = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", spotifyToken)
    }

    setSpotifyToken(spotifyToken)
    console.log(token)
    
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

  console.log(spotifyToken)


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

    function fetchSpotifyMediaData(readyMediaType, readyMediaId) {
      let spotifyMediaParams = {readyMediaType, readyMediaId}
      try{
        let response = axios.post("http://127.0.0.1:8000/api/media/getSpotifyMediaInfo/", spotifyMediaParams, {
        headers: {
          Authorization: "Bearer " + token,
        }
        },);
        console.log(response.data)
        var spotifyDataReturn = response.data;
        queryAppleMusic(spotifyDataReturn);
      } catch (error) {
        console.log(error.message);
      };
    };
    async function queryAppleMusic(spotifyDataReturn) {
      try{
        let response = await axios.get('http://127.0.0.1:8000/api/media/getAppleSharingUrl/');
        let appleMusicDataReturn = response.data;
        console.log(response.data);
        console.log(appleMusicDataReturn);
      } catch (error) {
        console.log(error.message);
      };
    };

  } else if (toggle === false) {
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
      console.log(splitUrlScoped[5])
    }
    fetchAppleMusicMediaData(readyMediaType, readyMediaId);

    function fetchAppleMusicMediaData(readyMediaType, readyMediaId) {
      let appleMusicMediaParams = {"appleMusicMediaParams":[readyMediaType, readyMediaId]}
      try{
        let response = axios.post("http://127.0.0.1:8000/api/media/getAppleMusicMediaInfo/", appleMusicMediaParams, {
          headers: {
            Authorization: "Bearer " + token,
          }
          },)
        console.log(response.data)
        var appleMusicDataReturn = response.data;
        console.log(appleMusicDataReturn);
      } catch (error) {
        console.log(error.message)
      }
      querySpotify(appleMusicDataReturn);
    };

  async function querySpotify(appleMusicDataReturn) {
    try {
      let response = await axios.get('http://127.0.0.1:8000/api/media/getSpotifySharingUrl/');
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

//   $.ajax({
//     url: 'http://127.0.0.1:8000/api/media/search_apple_music/',
//     type: 'GET',
//     dataType: 'json',
//     success: function(data) {
//         // display the links in the UI
//         setAppleSharingLinks(data.links)
//         console.log(appleSharingLinks)
//         // do something with the links...
//     },
//     error: function(xhr, status, error) {
//         // handle error
//     }
// });

// $.ajax({
//   url: "http://127.0.0.1:8000/api/media/search_spotify/",
//   type: "GET",
//   success: function(data) {
//       // Use the data returned by the API
//       console.log("External links: ", data.external_links);
//       setSpotifySharingLinks(data.external_links);
//       console.log(spotifySharingLinks);
//   },
//   error: function(jqXHR, textStatus, errorThrown) {
//       // Handle the error case
//       console.error("Error searching Spotify: ", textStatus, errorThrown);
//   }
// });



  return (
    <div className="container">
      <h1>Welcome home, {user.username}!</h1>
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
      <form onSubmit={handleSubmit}>
        <div>
        <p>Toggle between sharing Spotify or an Apple Music Media</p>
        <Switch onClick={spotifyOrApple}/>
        {toggle ? <span>Spotify</span> : <span>Apple Music</span>}
        </div>
      <input placeholder='Paste sharing link here' value={mediaInfo} onChange={(event) => setMediaInfo(event.target.value)}></input>
      <button type='submit'>Generate Sharing Capability</button>
      </form>
      {/* {toggle ? <span>{appleSharingLinks}</span> : <span>{spotifySharingLinks}</span>} */}
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