
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require('./keys.js')
// var omdb = require()
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
        else{console.log(data.tracks.items[1])}
      });
};

let twitter = function(){
   
    client.get('statuses/user_timeline', handle, function(error, tweets, response) {
        if (!error && response.statusCode === 200){
            for (i = 0; i < tweets.length; i++){
                console.log(tweets[i].created_at);
                console.log(tweets[i].user.name)
                console.log(tweets[i].text);
                
            }
        } else {console.log(error)}
     });

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
