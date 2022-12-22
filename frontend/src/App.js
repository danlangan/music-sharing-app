// General Imports
import { Routes, Route } from "react-router-dom";
import "./App.css";
import {KEY} from "./localKey";

// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";

useEffect(() => {
  // Spotify API Access Token
  var spotifyAuthParameters = {
    method : 'POST',
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&clientID=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
  }
  fetch('https://accounts.spotify.com/api/token', spotifyAuthParameters)
  .then(result => result.json())
  .then(data => setSpotifyAccessToken(data.access_token))

  // Apple Music API Access Token
  var appleMusicAuthParameters = {
    method : 'POST',
    headers : {
      'Content-Type': 'application'
    }
  }
},);

function App() {
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
