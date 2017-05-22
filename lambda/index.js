var Alexa = require('alexa-sdk');

// Constants
var constants =  require('./constants/constants');
// Data

// //Helpers
// var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var githubAPI = require('./helpers/githubAPI');

// var checkMeetupCity = require('../helpers/checkMeetupCity');
// var alexaDateUtil = require('../helpers/alexaDateUtil')

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.appId = constants.appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'NewSession': function () {
      this.emit(':ask', `Welcome to prowl. You can ask to seek the various developer jobs on the web!`, 'What would you like to do');
  },

  'GetJobs': function () {
    var jobs = githubAPI.GetGithubJobs;
    var jobsArray = [];

    for (var x in jobs) {
      jobsArray.push(jobs[x]);
    }

    this.emit(':ask', `I currently know of ${jobsArray.length} jobs. Check to see if the city you want to work in has a job!`, 'How else can I help?');
  },

  // TODO implement methods below

  // 'CityCheck': function () {
  //   var USCitySlot = this.event.request.intent.slots.USCity.value;
  //   var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;
  //
  //   // Get city
  //   var city;
  //   if (USCitySlot) {
  //     city = USCitySlot;
  //   } else if (EuropeanCitySlot) {
  //     city = EuropeanCitySlot;
  //   } else {
  //     this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
  //   }
  //
  //   // Check for our city
  //   var cityMatch = '';
  //   for (var i = 0; i < alexaMeetups.length; i++) {
  //     if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()){
  //       cityMatch = alexaMeetups[i].city;
  //     }
  //   }
  //
  //   if (cityMatch !== '') {
  //     this.emit(':ask, `There are currently ${} jobs in ${}`, How else can I help?');
  //   } else {
  //     this.emit(':ask', `Sorry, looks like there are no developer jobs in ${city}.`, 'How else can I help?');
  //   }
  // },
  //
  // 'GetJobsByCity': function () {
  //   var USCitySlot = this.event.request.intent.slots.USCity.value;
  //   var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;
  //
  //   // Get city
  //   var city;
  //   if (USCitySlot) {
  //     city = USCitySlot;
  //   } else if (EuropeanCitySlot) {
  //     city = EuropeanCitySlot;
  //   } else {
  //     this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
  //   }
  //
  //   // Check for our city
  //   var cityMatch = '';
  //   for (var i = 0; i < alexaMeetups.length; i++) {
  //     if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()){
  //       cityMatch = alexaMeetups[i].city;
  //     }
  //   }
  //
  //   if (cityMatch !== '') {
  //     this.emit(':ask, `There are currently ${} jobs in ${}`, How else can I help?');
  //   } else {
  //     this.emit(':ask', `Sorry, looks like there are no developer jobs in ${city}.`, 'How else can I help?');
  //   }
  // },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye');
  },

  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye');
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', `You can ask to seek the various developer jobs on the web! What would you like to do?`, 'What would you like to do?');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

};
