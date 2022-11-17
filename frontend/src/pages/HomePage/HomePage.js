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
  const [mediaId, setMediaId] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [mediaInfo, setMediaInfo] = useState('');

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
          setMediaType('track');
          return mediaType;
        case 'alb':
          setMediaType('album');
          return mediaType;
        case 'pla':
          setMediaType('playlist');
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
      }
    }

}
  return (
    <div className="container">
      <h1>Welcom home, {user.username}!</h1>

      <input onSubmit={getMediaInfo()}>{

      }</input>
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
