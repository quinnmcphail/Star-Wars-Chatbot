const { dialogflow } = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });
const fetch = require("node-fetch");

app.intent("Star Wars Info", (conv, { movieTitle }) => {
  getMovieMatch().then(movieMatch => {
    if (movieMatch.length) {
      conv.close(movieMatch[0].opening_crawl);
    } else {
      conv.close(`No movie found with the title ${movieTitle}`);
    }
  });
});

const getMovieMatch = async movieTitle => {
  let films = await fetch("https://swapi.co/api/films/");
  const response = await films.json();
  const movies = response.results;
  const movieMatch = movies.filter(movie => movieTitle === movie.title);
  return movieMatch;
};

exports.starWarsInfo = functions.https.onRequest(app);
