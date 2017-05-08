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
  },

  'AlexaMeetupCityCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get city
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    }
    else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    }
    else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
    }

    // Check for our city
    var cityMatch = '';
    for (var i = 0; i < alexaMeetups.length; i++) {
      if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()){
        cityMatch = alexaMeetups[i].city;
      }
    }

    // Respond to User
    if (cityMatch !== '') {
      this.emit(':ask', `Yes! ${city} has an Alexa developer meetup!`, 'How can I help?');
    }
    else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }

  },

  'AlexaMeetupOrganizerCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get city
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    }
    else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    }
    else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
    }

    // Check for our city
    var cityMatch = '';
    var cityOrganizers;
    for (var i = 0; i < alexaMeetups.length; i++) {
      if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()) {
        cityMatch = alexaMeetups[i].city;
        cityOrganizers = alexaMeetups[i].organizers;
      }
    }

    // Respond to User
    if (cityMatch !== '') {
      // 1 organizers
      if (cityOrganizers.length === 1) {
        this.emit(':ask', `The organizer of the ${city} Alexa developer meetup is ${cityOrganizers[0]}.`, 'How can I help?');
      }
      // Multiple organizers
      else {
        this.emit(':ask', `The organizers of the ${city} Alexa developer meetup are ${cityOrganizers.toString()}`, 'How can I help?');
      }
    }
    else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }

  }

};
