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
  // const [refinedMediaInfo, setRefinedMediaInfo] = useState('');
  const [splitUrl, setSplitUrl] = useState({});

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getMediaInfo();
    }
  });

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
    const splitUrl = mediaInfo.split('/');
    setSplitUrl(splitUrl);
    console.log(splitUrl)
    setMediaId(splitUrl[4]);
    console.log(mediaId);
    selectMediatype(splitUrl);
    // splitterFunction();
    // selectMediaInfo(splitUrl);
    // selectMediaId(splitUrl);
    fetchSpotifyMediaData();
    queryAppleMusic(translatedMedia);
    // function selectMediaInfo() {
    //   debugger;
    //   setRefinedMediaInfo(splitUrl[3]);
    //   return refinedMediaInfo;
    // };
  };

    function selectMediatype() {
      // debugger;
      switch(splitUrl[3]) {
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

    // function selectMediaId() {
    //   console.log(splitUrl[4])
    //   debugger;
    //   setMediaId(splitUrl[4])
    //   return mediaId
    // }

    async function fetchSpotifyMediaData() {
      // debugger;
      try{
        let response = await axios.get(`https://api.spotify.com/v1/${mediaType}/${mediaId}`);
        setTranslatedMedia(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error.message);
      };
      return translatedMedia;
    }

    async function queryAppleMusic() {
      try{
        let response = await axios.get(`https://api.music.apple.com/v1/me/library/search/${translatedMedia.artists.name}+${translatedMedia.name}`);
        setAppleMusicSearch(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      };
      return appleMusicSearch
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
