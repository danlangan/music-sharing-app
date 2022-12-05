import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import axios from "axios";

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  const [user, token] = useAuth();
  const [medias, setMedias] = useState([]);
  // const [mediaId, setMediaId] = useState('');
  // const [mediaType, setMediaType] = useState('');
  const [mediaInfo, setMediaInfo] = useState('');
  const [translatedMedia, setTranslatedMedia] = useState('');
  const [appleMusicSearch, setAppleMusicSearch] = useState('');
  // const [refinedMediaInfo, setRefinedMediaInfo] = useState('');
  // const [splitUrl, setSplitUrl] = useState([]);

  // useEffect(() => {
  //   let mounted = true;
  //   if (mounted) {
  //     getMediaInfo();
  //   }
  // });

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
  };

    // function selectMediatype(mediaTypeInfo) {
    //   console.log(mediaTypeInfo[3])
    //   // setMediaType(mediaTypeInfo[3])
    //   if (mediaTypeInfo[3] === 'track') {
    //     const readyMediaType = 'tracks';
    //   } else if (mediaTypeInfo[3] === 'album') {
    //     const readyMediaType = 'albums'
    //   } else if (mediaTypeInfo[3] === 'playlist'); {
    //     const readyMediaType = 'playlists'
    //   } 
    //   return readyMediaType;
    // };

      // switch(mediaTypeInfo[3]) {
      //   case 'track':
      //     setMediaType('tracks');
      //     break;
      //   case 'album':
      //     setMediaType('albums');
      //     let read = 'albums'
      //     break;
      //   case 'playlist':
      //     setMediaType('playlists');
      //     break;
      //   default:
      //     setMediaType(mediaTypeInfo[3]);
      // };
      // return readyMediaType;

    // function selectMediaId(mediaIdInfo) {
    //   console.log(mediaIdInfo[4]);
    //   const readyMediaId = mediaIdInfo[4];
    //   setMediaId(mediaIdInfo[4]);
    //   return readyMediaId;
    // };

    async function fetchSpotifyMediaData(readyMediaType, readyMediaId) {
      debugger;
      try{
        let response = await axios.get(`https://api.spotify.com/v1/${readyMediaType}/${readyMediaId}`);
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
