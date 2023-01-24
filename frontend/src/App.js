// General Imports
import { Routes, Route } from "react-router-dom";
import "./App.css";
// import {KEY} from "./localKey";
import './server'
// import { useEffect, useState } from "react";


// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";

function App() {

  // const [spotifyAccessToken, setSpotifyAccessToken] = useState('')

  // useEffect(() => {
    //   //Start Authentication Server Code
    //   // Spotify API Access Token
    //   var spotifyAuthParameters = {
    //     method : 'POST',
    //     headers : {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: 'grant_type=client_credentials&clientID=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    //   }
    //   fetch('https://accounts.spotify.com/api/token', spotifyAuthParameters)
    //   .then(result => result.json())
    //   .then(data => setSpotifyAccessToken(data.access_token))
    
    //   // Apple Music API Configuration
    //   document.addEventListener('musickitloaded', async function () {
    //     // Call configure() to configure an instance of MusicKit on the Web.
    //     try {
    //       await MusicKit.configure({
    //         developerToken: 'DEVELOPER-TOKEN',
    //         app: {
    //           name: 'musicsharingapp',
    //           build: '1978.4.1',
    //           alg: 'ES256',
    //           issuer: 'A4NXNNBMQ6',
    //           kid: 'Y8F8JV7CXD'
    //         },
    //       });
    //     } catch (err) {
    //       // Handle configuration error
    //     }
      
    //     // MusicKit instance is available
    //     const music = MusicKit.getInstance();
    //   });
    // },);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
