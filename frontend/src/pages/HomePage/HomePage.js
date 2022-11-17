import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

import axios from "axios";

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  //TODO: Add an AddCars Page to add a car for a logged in user's garage
  const [user, token] = useAuth();
  const [medias, setMedias] = useState([]);
  const [mediaId, setMediaId] = useState('');
  const [mediaType, setMediaType] = useState('');
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
    selectMediaInfo();
    selectMediatype();
    selectMediaId();
    fetchSpotifyMediaData();
    queryAppleMusic();

    function selectMediaInfo() {
      const input = document.getElementById('text-box');
      input.focus();
      input.setSelectionRange(25, 30);
      console.log(selectionRange);
      setMediaInfo(selectionRange);
    };

    function selectMediatype() {
      mediaInfo.focus();
      mediaInfo.setSelectionRange(0, 2);
      switch(selectionRange) {
        case 'tra':
          setMediaType('tracks');
          return mediaType;
        case 'alb':
          setMediaType('albums');
          return mediaType;
        case 'pla':
          setMediaType('playlists');
          return mediaType;
      }
    };

    function selectMediaId() {
      const input = document.getElementById('text-box');
      switch(mediaType) {
        case 'track':
          input.focus();
          input.setSelectionRange(32);
          console.log(selectionRange);
          setMediaId(selectionRange);
          return mediaId;
        case 'album':
          input.focus();
          input.setSelectionRange(32);
          console.log(selectionRange);
          setMediaId(selectionRange);
          return mediaId;
        case 'playlist':
          input.focus();
          input.setSelectionRange(35);
          console.log(selectionRange);
          setMediaId(selectionRange);
          return mediaId;
      }
    }

    async function fetchSpotifyMediaData(mediaType, mediaId) {
      try{
        let response = await axios.get(`https://api.spotify.com/v1/${mediaType}/${mediaId}`);
        setTranslatedMedia(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error.message);
      };
      return translatedMedia
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
  return (
    <div className="container">
      <h1>Welcom home, {user.username}!</h1>

      <input id='text-box' onSubmit={getMediaInfo()}>{}</input>
      {medias &&
        medias.map((media) => (
          <p key={media.id}>
            {media.track} {media.album} {media.playlist} {media.trackLink} {media.albumLink} {media.playlistLink} {media.appleMusic} {media.spotify}
          </p>
        ))}
    </div>
  );
};

export default HomePage;
