var Alexa = require('alexa-sdk');

// Data
var alexaMeetups = require('./data/alexaMeetups');

//Helpers
var convertArrayToReadableString = require('./helpers/convertArrayToReadableString');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'NewSession': function () {
    this.emit(':ask', 'Welcome to Group Finder, The skill that gives you information about the alexa developer community. You can ask me about the various alexa meetups around the world. But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.', 'Tell me your name by saying: My name is, and then your name.');
  },

  'NameCapture': function () {
    // Get Slot Values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

    // Get Name
    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    }
    else if (UKFirstNameSlot) {
      name = UKFirstNameSlot;
    }

    // Save Name in Session Attributes and Ask For Country
    if (name) {
      this.attributes['userName'] = name;
      this.emit(':ask', `Ok, ${name}! Tell me what country you're from by saying: I'm from, and then the country you're from.`, 'Tell me what country you\'re from by saying: I\'m from, and then the country you\'re from.');
    }
    else {
      this.emit(':ask', `Sorry, I didn\'t recognise that name!`, `Pleae tell me your name by saying: My name is, and then your name.`, 'Pleae tell me your name by saying: My name is, and then your name.');
    }
  },

  'CountryCapture': function () {
    //Get Slot Values
    var country = this.event.request.intent.slots.Country.value;

    // Get User Name from Session attributes
    var userName = this.attributes['userName'];

    // Save Country Name in Session Attributes and Ask for Favorite Programming Language
    if (country) {
      this.attributes['userCountry'] = country;
      this.emit(':ask', `Ok ${userName}! Your from ${country}, that's great! You can ask me about the various alexa meetups around the world. What would you like to do?`, 'What would you like to do?');
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognise that country!`, `Please tell me what country you\'re from by saying: I\'m from, and then the country you\'re from.`);
    }
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
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
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
    } else {
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
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
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
      } else { // Multiple organizers
        this.emit(':ask', `The organizers of the ${city} Alexa developer meetup are ${convertArrayToReadableString(cityOrganizers)}`, 'How can I help?');
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }

  }

};
