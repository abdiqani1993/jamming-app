import React, { useState } from "react";

export default function SaveToSpotify({ accessToken, playlist }) {
  const [spotifyID, setSpotifyID] = useState('');
  const [createdPlaylist, setCreatedPlaylist] = useState('');

  async function addToSpotify() {
    try {
      // Fetch the user's Spotify ID
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });

      const data = await response.json();
      setSpotifyID(data.id);
      console.log('Spotify ID:', data.id);

      // Create a new playlist
      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(data.id)}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json' // Specifies to server that the body content is in JSON format
        },
        body: JSON.stringify({
          name: createdPlaylist, // Required field by Spotify, createdPlaylist is state variable
          description: 'A playlist created by the app', // Optional field
          public: true // Optional field, set to true if you want it to be public
        }),
      });

      const playlistData = await playlistResponse.json();
      console.log('Created Playlist:', playlistData);

      // Add tracks to the newly created playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistData.id)}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: playlist.map(track => track.uri) // Extract URIs from the playlist array
        }),
      });

      const addTracksData = await addTracksResponse.json();
      console.log('Added tracks to playlist:', addTracksData);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const playlistName = (event) => {
    setCreatedPlaylist(event.target.value);
  }

  return (
    <div className="top-corner">
      <input
        type="text"
        value={createdPlaylist}
        placeholder="Create playlist"
        onChange={playlistName} />
      <button onClick={addToSpotify}>Create Playlist</button>
    </div>
  );
}
