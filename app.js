require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
 spotifyApi
   .clientCredentialsGrant()
   .then(data => spotifyApi.setAccessToken(data.body['access_token']))
   .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
  res.render('home', {
    css : ['home'],
    title : 'Home Page Search'
  })
})

app.get('/artist-search', (req, res) => {

  spotifyApi.searchArtists(req.query.artist)
  .then(data => {
    // res.send(data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {
      css : ['search'],
      title : 'Artist search results',
      artists : data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/albums/:artistId', (req, res) => {

  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((data) => {
    // console.log("Artist Albums: ", data.body.items);
    res.render('albums', {
      css : ['albums'],
      title : 'Artist Albums',
      albums: data.body.items }
    )
  })
  .catch(err => console.log('The error while searching albums occurred: ', err))
})

app.get('/albums/tracks/:albumId', (req, res) => {

  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((data) => {
    // console.log("List of Tacks: ", data.body.items)
    res.render("tracks", { 
    css : ['tracks'],
    title : 'Tracks List',
    tracks: data.body.items }
    )
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err))
}) 

app.listen(3000, () => console.log('My Spotify project running on port http://localhost:3000 🎧 🥁 🎸 🔊'));