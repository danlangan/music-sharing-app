import React from "react";
import appleMusicKey from '../../localKey'

const [appleMusicKey, setAppleMusicKey] = useState(appleMusicKey)

document.addEventListener('musickitloaded', function() {
    // MusicKit global is now defined
    MusicKit.configure({
      developerToken: appleMusicKey,
      app: {
        name: 'music-sharing-app',
        build: '1978.4.1',
        alg: ''
      }
    });
  });

const configuration = {

}

static MusicKit.MusicKitInstance configure(MusicKit.Configuration, configuration)

let music = MusicKit.getInstance();

 // This is called with or without authorization: 
 music.player.play();

 // This ensures user authorization before calling play():
 music.authorize().then(function() {
   music.player.play();
 });

 // You can wrap any method to ensure authorization before calling:
 music.authorize().then(function() {
   music.api.library.albums.then(function(cloudAlbums) {
     // user's cloudAlbums
   });
 });


 const stringToResource = 'https://developer.apple.com/documentation/musickitjs/accessing_musickit_features_using_javascript'