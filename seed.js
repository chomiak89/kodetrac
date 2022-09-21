const snippets = [
  {
    name: "n1",
    sid: "sup1",
    label: "A new snippet",
    code: "const x = 10",
    lang: "js",
  },
  {
    name: "n2",
    sid: "sup2",
    label: "A second new snippet",
    code: "let y = 411",
    lang: "js",
  },
  {
    name: "n3",
    sid: "sup3",
    label: "A third new snippet",
    code: "const x = 10\nconst b = 15\n  x = 5\nconst i = 12",
    lang: "js",
  },
];

const mongoose = require("mongoose");

const Snippet = require("./models/Snippet.model");
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/kodetrac";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

Snippet.create(snippets)
  .then((snippets) => {
    //CLOSE THE DATABASE CONNECTION
    mongoose.connection.close();
    console.log("DATABASE SEEDING COMPLETE -- DB CONNECTION CLOSED!");
  })
  .catch((err) => console.log(err));
//seed the db with the movie model
//Movie.save(movies)

//Close connection to db
