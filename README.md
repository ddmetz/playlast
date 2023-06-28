# Playlast
React app to view Last.fm scrobbles for Spotify playlists

![cropped](https://github.com/ddmetz/playlast/assets/77217897/17c5b2c1-a55b-48b4-9d6f-bc0dc731badc)

## Setup
1. [Create a Spotify app](https://developer.spotify.com/dashboard/create), Set the redirect URI to:
```
http://localhost:3000
```
2. In `src/App.js` set `SPOTIFY_CLIENT_ID` to your Client ID.

3. [Create a Last.fm API account](https://www.last.fm/api/account/create)
4. In `src/App.js` set `LASTFM_API_KEY` to your key.
5. Start the app
```
npm start
```
