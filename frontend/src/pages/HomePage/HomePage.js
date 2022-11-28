import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import axios from "axios";

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  const [user, token] = useAuth();
  const [medias, setMedias] = useState([]);
  const [mediaId, setMediaId] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaInfo, setMediaInfo] = useState('');
  const [translatedMedia, setTranslatedMedia] = useState('');
  const [appleMusicSearch, setAppleMusicSearch] = useState('');
  const [refinedMediaInfo, setRefinedMediaInfo] = useState('');

  useEffect(() => {
    const splitUrl = mediaInfo.split('/')
    console.log(splitUrl[3])
    console.log(splitUrl[4])
  })

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
    selectMediaInfo();
    selectMediatype();
    selectMediaId();
    fetchSpotifyMediaData();
    queryAppleMusic();

    function selectMediaInfo(splitUrl) {
      debugger;
      // let splitUrl = mediaInfo.split('/')
      // console.log(splitUrl[3])
      // let newMediaInfo = splitUrl[3]
      setRefinedMediaInfo(splitUrl[3]);
      return refinedMediaInfo;
    };

    function selectMediatype() {
      debugger;
      switch(refinedMediaInfo) {
        case 'track':
          setMediaType('tracks');
          break;
        case 'album':
          setMediaType('albums');
          break;
        case 'playlist':
          setMediaType('playlists');
          break;
      }
      return mediaType
    };

    function selectMediaId() {
      debugger;
      switch(mediaInfo) {
        case 'track':
          mediaInfo.slice(32);
          console.log(mediaInfo);
          setMediaId(mediaInfo);
          break;
        case 'album':
          mediaType.slice(32);
          console.log(mediaInfo);
          setMediaId(mediaInfo);
          break;
        case 'playlist':
          mediaType.slice(35);
          console.log(mediaInfo);
          setMediaId(mediaInfo);
          break;
      }
      return mediaId
    }

    async function fetchSpotifyMediaData() {
      debugger;
      try{
        let response = await axios.get(`https://api.spotify.com/v1/${mediaType}/${mediaId}`);
        setTranslatedMedia(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error.message);
      };
      return translatedMedia;
    }

    async function queryAppleMusic(translatedMedia) {
      try{
        let response = await axios.get(`${translatedMedia.artists.name}+${translatedMedia.name}`); // need to have the correct link inputted here in order to have this work correctly
        setAppleMusicSearch(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      };
      return appleMusicSearch
    }
  }

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
