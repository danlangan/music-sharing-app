import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import axios from "axios";

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  const [user, token] = useAuth();
  const [medias, setMedias] = useState([]);
  const [mediaInfo, setMediaInfo] = useState('');
  const [translatedMedia, setTranslatedMedia] = useState('');
  const [appleMusicSearch, setAppleMusicSearch] = useState('');

  useEffect(() => {
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
    fetchSpotifyMediaData(readyMediaType, readyMediaId);

    async function fetchSpotifyMediaData(readyMediaType, readyMediaId) {
      debugger;
      try{
        let response = await axios.get(`https://api.spotify.com/v1/${readyMediaType}/${readyMediaId}`);
        let spotifyDataReturn = (response.data);
        // setTranslatedMedia(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error.message);
      };
      function getSpotifyApiData(spotifyDataReturn) {
        if (readyMediaType === 'tracks') {
          let parsedSpotifyData = `'mediaName' : ${spotifyDataReturn.href}`
      } else if (readyMediaType === 'playlists') {
          let parsedSpotifyData = `'mediaName' : ${spotifyDataReturn.href}`
      } else if (readyMediaType === 'albums') {
        let parsedSpotifyData = `'mediaName' : ${spotifyDataReturn.href}`
      };
    }};
    // there is lots of building out to do left in the code above but that is the overall structure as to how to know what dot notation to use to access certain information within the variables
  };

    

    async function queryAppleMusic() {
      try{
        let response = await axios.get(`https://api.music.apple.com/v1/me/library/search/${translatedMedia.artists.name}+${translatedMedia.name}`);
        setAppleMusicSearch(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      };
      return appleMusicSearch
    };
  

  function handleSubmit(event) {
    event.preventDefault();
    getMediaInfo(mediaInfo);
  }

  return (
    <div className="container">
      <h1>Welcom home, {user.username}!</h1>
      <form onSubmit={handleSubmit}>
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
