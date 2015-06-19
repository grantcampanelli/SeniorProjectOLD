var _ = require('underscore')
var majors = require('./calpoly-majors');
var util = require.main.require('./app/util');
var usernameCount = new Object();

module.exports = (function generateMockUsers(names) {
   var users = names.map(splitFullname);
   for (var user of users) {
      user.username = user.password = mkUsername(user.first, user.last);
      user.major = majors[Math.floor(Math.random() * majors.length)];
      user.email = mkEmail(user.username);
      user.emplId = util.randomString('0123456789', 9);
   }
   return users;
})([
    /* 
    Found this list at
    http://en.wikipedia.org/wiki/List_of_Game_of_Thrones_characters
    */
   "Aidan Gillen",
   "Alfie Allen",
   "Amrita Acharia",
   "Art Parkinson",
   "Arya Stark",
   "Ben Crompton",
   "Ben Hawkey",
   "Bran Stark",
   "Catelyn Stark",
   "Cersei Lannister",
   "Charles Dance",
   "Ciaran Hinds",
   "Conleth Hill",
   "Daario Naharis",
   "Daenerys Targaryen",
   "Daniel Portman",
   "Davos Seaworth",
   "Dean-Charles Chapman",
   "Diana Rigg",
   "Dominic Carter",
   "Donald Sumpter",
   "Eddard Stark",
   "Ellaria Sand",
   "Emilia Clarke",
   "Esme Bianco",
   "Eugene Simon",
   "Finn Jones",
   "Gwendoline Christie",
   "Hannah Murray",
   "Harry Lloyd",
   "Iain Glen",
   "Ian Beattie",
   "Ian McElhinney",
   "Indira Varma",
   "Isaac Hempstead-Wright",
   "Iwan Rheon",
   "Jack Gleeson",
   "Jacob Anderson",
   "Jaime Lannister",
   "James Cosmo",
   "Jaqen H'ghar",
   "Jason Momoa",
   "Jeor Mormont",
   "Jerome Flynn",
   "Joe Dempsie",
   "Joffrey Baratheon",
   "John Bradley",
   "Jon Snow",
   "Jonathan Pryce",
   "Jorah Mormont",
   "Josef Altin",
   "Julian Glover",
   "Khal Drogo",
   "Kit Harington",
   "Kristian Nairn",
   "Kristofer Hivju",
   "Lena Headey",
   "Liam Cunningham",
   "Maisie Williams",
   "Margaery Tyrell",
   "Mark Addy",
   "Michael McElhatton",
   "Michelle Fairley",
   "Michiel Huisman",
   "Natalia Tena",
   "Natalie Dormer",
   "Nathalie Emmanuel",
   "Nikolaj Coster-Waldau",
   "Olenna Tyrell",
   "Oona Chaplin",
   "Owen Teale",
   "Pedro Pascal",
   "Peter Dinklage",
   "Petyr Baelish",
   "Ramsay Bolton",
   "Richard Madden",
   "Robb Stark",
   "Robert Baratheon",
   "Ron Donachie",
   "Roose Bolton",
   "Rory McCann",
   "Rose Leslie",
   "Roxanne McKee",
   "Roy Dotrice",
   "Samwell Tarly",
   "Sandor Clegane",
   "Sansa Stark",
   "Sean Bean",
   "Sibel Kekilli",
   "Sophie Turner",
   "Stannis Baratheon",
   "Stephen Dillane",
   "Talisa Stark",
   "Theon Greyjoy",
   "Thomas Brodie-Sangster",
   "Tom Wlaschiha",
   "Tommen Baratheon",
   "Tormund Giantsbane",
   "Tyrion Lannister",
   "Tyrion Lannister",
   "Tytos Lannister",
   "Tywin Lannister",
   "Viserys Targaryen"
]);

function mkEmail(username) {
   var email = new Buffer(username.replace(/[^-a-zA-Z0-9_\.]/g, '') + '@calpoly.edu');
   return email.toString('ascii');
}

function mkUsername(first, last) {
   var username = first.charAt(0) + last;
   username = username.toLowerCase().replace(/[^a-z0-9]/, '');
   if (usernameCount[username]) {
      var oldUsername = username;
      username = username + String(usernameCount[username]);
      usernameCount[oldUsername] += 1;
   }
   else {
      usernameCount[username] = 1;
   }
   return username;
}

function splitFullname(fullname){
   var name = fullname.split(' ', 2);
   return {
      first: name[0],
      last: name[1]
   };
}
