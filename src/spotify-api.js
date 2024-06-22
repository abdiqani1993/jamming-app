import React, { useState, useEffect } from "react";
import SaveToSpotify from './saveToSpotify';
import './App.css'; 

export default function SpotifyApi() {
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlist, setPlaylist] = useState([]);


  //does the autherzation from spotify it uses the client id from spotify and creats a url
  function authorizeSpotify() {
    const client_id = 'c58f535bd0c44016aa11dde4c6e1349e';
    const redirect_uri = 'http://localhost:3000/';
    //const scopes = 'user-read-private user-read-email';
    const scopes = 'user-read-private user-read-email playlist-modify-public';


  /*creats state for security purposes does this by adding randon letters and nums to the url
  and stores them the local storage below and once request is made it cross refernces with 
  the storage below and the returned url from spotify*/
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);

    const url = 'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' + encodeURIComponent(client_id) +
      '&scope=' + encodeURIComponent(scopes) +
      '&redirect_uri=' + encodeURIComponent(redirect_uri) +
      '&state=' + encodeURIComponent(state);

    window.location = url;//opens url in same page, once autherzation is done
  }
// creates the random string to be added to the url for state security
  function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  //this removes the hash symbol from the url and uses URLsearchparams to get the access token from the url
  useEffect(() => {
    function getAccessTokenFromURL() {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return params.get('access_token');
    }

//if token is successfully extracted it is logged to the console and also saved to state variable accessToken via SetAccessToken()
    const token = getAccessTokenFromURL();
    if (token) {
      console.log('Access Token:', token);
      setAccessToken(token);
      window.location.hash = '';
    } else {
      console.log('No access token found in URL');
    }
  }, []);/*the conditions in the  useEffect hook are it mounts(executes) when first rendered, as the second argument in the hook is
  an empty array*/


  /*this does the actual api call, we fetch from spotify api if accessToken is not true(i.e empty) and the returned 
  respone.json is then saved to the const data. data is them logged, to see the contents in the console. we then save the parts of
  date variable we need to our state variable tracks, via setTracks() */
  async function getTrack() {
    if (!accessToken) {
      alert('No access token available');
      return;
    }//the fetch request below has encode method to convert the searchQuery state variable to url standerds
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });

      const data = await response.json();
      console.log(data);
      setTracks(data.tracks.items);
    } catch (error) {
      console.error('Error fetching track:', error);
    }
  };

  //this saves the returned tracks from the api call to our state variable playlist
  function addToPlaylist(track) {
    setPlaylist([...playlist, track]);
  }



  return (
    <div className="container">
      <div className="authorization">
        <h1>Authorize</h1>
        <button onClick={authorizeSpotify}>Authorize with Spotify</button>
        {accessToken && <p>Access Token: Verified</p>}
      </div>

      <div className="search">
        <h1>Search</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a track"
        />
        <button onClick={getTrack}>Search Tracks</button>
      </div>

      <div className="results-container">
        {tracks.length > 0 && (
          <ul className="search-results">
            {tracks.map(track => (
              <li key={track.id}>
                <p><strong>{track.artists[0].name}: {track.name}</strong></p>
                <button onClick={() => addToPlaylist(track)}>Add to Playlist</button>
                <p>Album: {track.album.name}</p>
                <p>Preview: <a href={track.preview_url} target="_blank" rel="noopener noreferrer">Listen</a></p>
              </li>
            ))}
          </ul>
        )}

        {playlist.length > 0 && (
          <div className="playlist">
            <h1>My Playlist</h1>
            <ol>
              {playlist.map(track => (
                <li key={track.id}>
                  <p><strong>{track.artists[0].name}: {track.name}</strong></p>
                  <p>Album: {track.album.name}</p>
                  <p>Preview: <a href={track.preview_url} target="_blank" rel="noopener noreferrer">Listen</a></p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <SaveToSpotify accessToken={accessToken} playlist={playlist} />
    </div>
  );
}
