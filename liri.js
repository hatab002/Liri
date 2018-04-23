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
let userSearch = process.argv[3];
for (let i = 4; i < process.argv.length; i++) {
    userSearch += `+${process.argv[i]}`;
}
const twitterParam = {
    screen_name: 'notsodomtorett',
    count: 20
};
let spotifyCall = function () {
    if (!userSearch) {
        userSearch = "track:The+Sign+artist:Ace+of+Base";
    }
    spotify.search({
        type: 'track',
        query: userSearch
    }, function (err, data) {
        let songInfo = data.tracks.items[0];
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log(`Album: ${songInfo.album.name}`)
            console.log(`Artist: ${songInfo.artists[0].name}`)
            console.log(`Song name: ${songInfo.name}`)
            if (songInfo.preview_url) {
                console.log(`Preview URL: ${songInfo.preview_url}`)
            } else {
                console.log("Preview URL: Sorry, there is no preview URL.")
            }
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

let movieTime = function (userSearch) {
    var queryURL = `http://www.omdbapi.com/?t=${userSearch}&y=&plot=short&apikey=trilogy`;
    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let parsedBody = JSON.parse(body)
            console.log("The movie's title: " + parsedBody.Title);
            console.log("The movie's release date: " + parsedBody.Released);
            console.log("The movie's actors: " + parsedBody.Actors);
            console.log("The movie's plot: " + parsedBody.Plot);
            console.log("The movie's language: " + parsedBody.Language);
            console.log("The movie's imdb rating: " + parsedBody.imdbRating);
            if (parsedBody.Ratings) {
                console.log("The movie's Rotten Tomatoes Rating: " + parsedBody.Ratings[1].Value);
                console.log("-----------------------------------")
            } else {
                console.log("The movie's rotten tomatoes rating: Sorry there is no Rotten Tomatoes Rating for this one!")
            };
        } else {
            console.log("Error: Movie not found!");
        }
    });
}

let justDoItAlready = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        queryText = data.split(",")
        userSearch = queryText[1]
        spotifyCall(userSearch);
    })
};
// switch (command) {
//     case "my-tweets":
//         twitter();
//         break;
//     case "spotify-this-song":
//         spotifyCall();
//         break;
//     case "movie-this":
//         if (userSearch) {
//             movieTime(userSearch);
//         } else {
//             movieTime("Mr. Nobody")
//         }
//         break;
//     case "do-what-it-says":
//         justDoItAlready();
//         break;
// }

function inq() {
    inquirer.prompt([{
        type: "rawlist",
        name: "yourWishIsMyCommand",
        message: "It's you again! How may I be of service?",
        choices: ['Do what you will!', 'Show me my tweets!', 'Tell me about this movie!', 'Spotify this song for me!']
    }]).then(function (response) {
        choiceResponse = response.yourWishIsMyCommand;

        switch (choiceResponse) {
            case 'Do what you will!':
                justDoItAlready();
                break;
            case 'Show me my tweets!':
                twitter();
                break;
            case 'Tell me about this movie!':
                inquirer.prompt([{
                    type: "input",
                    name: "movie",
                    message: "Which movie would you like me to lookup?"
                }, ]).then(function (responseOmdb) {
                    if (!userSearch) {
                        movieTime("Mr. Nobody");
                    }
                    userSearch = responseOmdb.movie;
                    movieTime(userSearch);

                });
                break;
            case 'Spotify this song for me!':
                inquirer.prompt([{
                    type: "input",
                    name: "song",
                    message: "Enter a song name"
                }, ]).then(function (responseSpotify) {
                    if (!userSearch) {
                        userSearch = "track:The+Sign+artist:Ace+of+Base";
                    }
                    userSearch = responseSpotify.song
                    spotifyCall(userSearch);
                });
                break;
        }
    });
}
inq();