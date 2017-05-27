var Alexa = require('alexa-sdk');

// Constants
var constants =  require('./constants/constants');

// //Helpers
var githubAPI = require('./helpers/githubAPI');
var checkCity = require('./helpers/checkCity');
// var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
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
    githubAPI.GetGithubJobs().then((jobs) => {
      if (Object.keys(jobs).length === 1) {
        this.emit(':ask', `I currently know of ${Object.keys(jobs).length} job. Check to see if the city you want to work in has a job!`, 'How else can I help?');
      } else {
        this.emit(':ask', `I currently know of about ${Object.keys(jobs).length} jobs. Check to see if the city you want to work in has a job!`, 'How else can I help?');
      }
    }).catch((error) => {
      console.log("github jobs API Error")
      this.emit(':tell', `There was an ${error}`, 'How else can I help?');
    });
  },

  'CityCheck': function () {
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;
    // Get city
    var location = checkCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    githubAPI.GetGithubJobsByLocation(location).then((jobs) => {
      if (Object.keys(jobs).length === 1) {
        this.emit(':ask', `I currently know of ${Object.keys(jobs).length} job in ${location}.`, 'How else can I help?');
      } else {
        this.emit(':ask', `I currently know of ${Object.keys(jobs).length} jobs in ${location}.`, 'How else can I help?');
      }
    }).catch((error) => {
      console.log("github jobs API Error")
      this.emit(':tell', `There was an ${error}`, 'How else can I help?');
    });
  },

  'GetJobTypeByCity': function () {
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get city
    var location = checkCity(USCitySlot, EuropeanCitySlot);

    // Get Job
    var jobType = this.event.request.intent.slots.JobType.value;
    var description;
    if (jobType) {
      description = jobType
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that job type.', 'How can I help?');
    }

    // Respond to User
    githubAPI.GetGithubJobsByDescriptionLocation(description, location).then((jobs) => {
      if (Object.keys(jobs).length === 1) {
        this.emit(':ask', `There is currently ${Object.keys(jobs).length} ${description} job in ${location}.`, 'How else can I help?');
      } else {
        this.emit(':ask', `There are currently ${Object.keys(jobs).length} ${description} jobs in ${location}.`, 'How else can I help?');
      }
    }).catch((error) => {
      console.log("github jobs API Error")
      this.emit(':tell', `There was an ${error}`, 'How else can I help?');
    });
  },

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
