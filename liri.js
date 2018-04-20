
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require('./keys.js')
var omdb = require('omdb')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
let command = process.argv[2]
let search = process.argv[3]
let handle = {screen_name: 'notsodomtorett'}

let spotifyCall = function(){
    spotify.search({ type: 'track', query: search }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        else{
            console.log(`Album: ${data.tracks.items[1].album.name}`)
            console.log(`Artist: ${data.tracks.items[1].artists[0].name}`)
            console.log(`Preview URL: ${data.tracks.items[1].preview_url}`)
            console.log(`Song name: ${data.tracks.items[1].name}`)
        }
      });
};

let twitter = function(){
   
    client.get('statuses/user_timeline', handle, function(error, tweets, response) {
        if (!error && response.statusCode === 200){
            for (i = 0; i < tweets.length; i++){
                console.log(tweets[i].user.name);
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                
            }
        } else {console.log(error)}
     });

}

let movieTime = function(){

    request(`http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`, function(error, response, body) {

  if (!error && response.statusCode === 200) {
    console.log("The movie's title: " + JSON.parse(body).Title);
    console.log("The movie's release date: " + JSON.parse(body).Released);
    console.log("The movie's actors: " + JSON.parse(body).Actors);
    console.log("The movie's plot: " + JSON.parse(body).Plot);
    console.log("The movie's language: " + JSON.parse(body).Language);

    console.log("The movie's imdb rating: " + JSON.parse(body).imdbRating);
    console.log("The movie's rotten tomatoe rating: " + JSON.parse(body).Ratings[1].Value);
  
  }
});
}
if (command === "movie" && search === ""){
    let search = "Mr. Nobody";
    movieTime();
    }
if (command === "spotify"){

    spotifyCall();
} else{
    console.log("spotify not working")
};

if (command === "twitter"){
    twitter();
} else {
    console.log("twitter not working")
}
if (command === "movie"){
    movieTime();
} else {
    console.log("movie not working")
}
