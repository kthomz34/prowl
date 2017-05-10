var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var alexaMeetups = require('../data/alexaMeetups');

//Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');

// Main Handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Welcome User back by Name
      this.emit(':ask', `Welcome back ${userName}! You can ask me about the various alexa meetups around the world.`, 'What would you like to do');
    } else {
      this.handler.state = constants.states.ONBOARDING;
      this.emitWithState('NewSession');
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

  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye');
  },

  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye');
  },

  'SessionEndedRequest': function () {
    // Forces State to Save when the user times out
    this.emit('savedState', true);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', `You can ask me about the various alexa meetups around the world. What would you like to do?`, 'What would you like to do?');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = mainStateHandlers;
