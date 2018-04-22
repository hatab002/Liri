require("dotenv").config();
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require('./keys.js');
var omdb = require('omdb');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
let command = process.argv[2];
let search = process.argv[3];
const twitterParam = {
    screen_name: 'notsodomtorett',
    count: 20
};
const spotifyParam = {
    type: 'track',
    query: search
}

let spotifyCall = function (search) {
    spotify.search(spotifyParam, function (err, data) {
        let songInfo = data.tracks.items[0];
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log(`Album: ${songInfo.album.name}`)
            console.log(`Artist: ${songInfo.artists[0].name}`)
            console.log(`Preview URL: ${songInfo.preview_url}`)
            console.log(`Song name: ${songInfo.name}`)
        }
    });
};

let twitter = function () {
    client.get('statuses/user_timeline', twitterParam, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            for (i = 0; i < tweets.length; i++) {
                console.log(`Tweets by: ${tweets[i].user.name}`);
                console.log(`Tweeted on: ${tweets[i].created_at}`);
                console.log(`Tweet: ${tweets[i].text}`);
                console.log("-------------------")
            }
        } else {
            console.log(error)
        }
    });
}

let movieTime = function (search) {
    var queryURL = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`;
    request(queryURL, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            let parsedBody = JSON.parse(body)
            console.log("The movie's title: " + parsedBody.Title);
            console.log("The movie's release date: " + parsedBody.Released);
            console.log("The movie's actors: " + parsedBody.Actors);
            console.log("The movie's plot: " + parsedBody.Plot);
            console.log("The movie's language: " + parsedBody.Language);
            console.log("The movie's imdb rating: " + parsedBody.imdbRating);
            console.log("The movie's rotten tomatoes rating: " + parsedBody.Ratings[1].Value);
        } else {
            console.log(err)
        }
    });
}

let justDoItAlready = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        var queryText = data.split(", ")
        spotifyCall(queryText[1])
    })
};

switch (command) {
    case "my-tweets":
        twitter();
        break;
    case "spotify-this-song":
        spotifyCall();
        break;
    case "movie-this":
        if (search) {
            movieTime(search);
        } else {
            movieTime("Mr. Nobody")
        }
        break;
    case "do-what-it-says":
        justDoItAlready();
}


// inquirer.prompt([{
//     type: "list",
//     name: "yourWishIsMyCommand",
//     message: "Hello there! How may I be of service?",
//     choices: ["Do what you will!", "Show me my tweets!", "Tell me about this movie!", "Spotify this song for me!"]
// }, ]).then((response) => {
//     if (response.yourWishIsMyCommand === "Do what you will!") {
//         justDoItAlready();
//     } else if (response.yourWishIsMyCommand === "Show me my tweets!") {
//         twitter();
//     } else if (response.yourWishIsMyCommand === "Tell me about this movie!") {
//         inquirer.prompt([{
//             type: "input",
//             name: "movie",
//             message: "Which movie would you like me to lookup?"
//         }, ]).then((responseMovie) => {
//             movieTime(responseMovie.movie);
//         });
    
//     } else if (response.yourWishIsMyCommand === "Spotify this song for me!") {
//         inquirer.prompt([{
//             type: "input",
//             name: "song",
//             message: "Enter a song name"
//         }, ]).then((songResponse) => {
//             spotifyCall(songResponse.song);
//         });
//     }
// });