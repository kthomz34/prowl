var Alexa = require('alexa-sdk');

// Data
var alexaMeetups = require('./data/alexaMeetups');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask', 'Welcome to Group Finder!', 'Try saying hello!');
  },

  'Hello': function () {
    this.emit(':tell', 'Hi there!');
  },

  'AlexaMeetUpNumbers': function () {
    var meetupNumbers = alexaMeetups.length;
    this.emit(':ask', `I currently know of ${meetupNumbers} Alexa developer meetups. Check to see if your city is one of them!`, 'How can I help?');
  }

};
