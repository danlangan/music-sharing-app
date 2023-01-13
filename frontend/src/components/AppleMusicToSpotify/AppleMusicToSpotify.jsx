import React from "react";
import appleMusicKey from '../../localKey'

const [appleMusicKey, setAppleMusicKey] = useState(appleMusicKey)

curl = {-v, -H, 'Authorization: Bearer [developer token]', "https://api.music.apple.com/v1/test"}


document.addEventListener('musickitloaded', function() {
    // MusicKit global is now defined
    MusicKit.configure({
      developerToken: appleMusicKey,
      app: {
        name: 'music-sharing-app',
        build: '1978.4.1'
      }
    });
  });

const configuration = {
    alg: '',
    kid: '',
    iss: '',
    exp: '',
    iat: '',
}

// static MusicKit.MusicKitInstance configure(MusicKit.Configuration, configuration)

// not sure if the above static declaration is for swift or if it is usable for JavaScript as well... doing more research and will get to the botton of it

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


 <head>
 [...]
 <meta name="apple-music-developer-token" content="DEVELOPER-TOKEN"/>
 <meta name="apple-music-app-name" content="My Cool Web App"/>
 <meta name="apple-music-app-build" content="1978.4.1"/>
 [...]
</head>

<button id="apple-music-authorize"></button>
<button id="apple-music-unauthorize"></button>
