var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var alexaMeetups = require('../data/alexaMeetups');

//Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var meetupAPI = require('../helpers/meetupAPI');
var checkMeetupCity = require('../helpers/checkMeetupCity');
var alexaDateUtil = require('../helpers/alexaDateUtil')

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

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {
      this.emit(':ask', `Yes! ${cityMatch.city} has an Alexa developer meetup!`, 'How can I help?');
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaMeetupOrganizerCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {

      // Account Linked
        // Get Meetup Group Details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
          .then((meetupDetails) => {
            // Get Organizer Name
            var organizerName = meetupDetails.organizer.name;

            var cardTitle = `${organizerName}`;
            var cardContent = `The organizer of the ${cityMatch.city} Alexa developer meetup is ${organizerName}!`;

            var imageObj = {
                smallImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
                largeImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
            };

            // Response to User
            this.emit(':askWithCard', `The organizer of the ${cityMatch.city} Alexa developer meetup is ${organizerName}.`, 'How can I help?', cardTitle, cardContent, imageObj);
          })
          .catch((error) => {
            console.log('Meetup API ERROR', error);
            this.emit(':tell', `Sorry, there was a problem accessing your meetup account details.`);
          });
      // this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaMeetupMembersCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {

      // Get Access Token from Alexa request
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {
        // Get Meetup Group Details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
          .then((meetupDetails) => {
            // Get number of meetup members
            var meetupMembers = meetupDetails.members;

            // Response to User
            this.emit(':ask', `The ${cityMatch.city} Alexa developer meetup currently has ${meetupMembers} members! How else can I help you?`, 'How can I help?');
          })
          .catch((error) => {
            console.log('Meetup API ERROR', error);
            this.emit(':tell', `Sorry, there was a problem accessing your meetup account details.`);
          });
      } else {
        // Account Not Linked
        this.emit(':tellWithLinkAccountCard', `Please link your account to use this skill. I\'ve sent the details to your alexa app.`);
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaNextMeetupCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {

      // Get Access Token from Alexa request
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {
        // Get Meetup Group Details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
          .then((meetupDetails) => {
            // Get next event
            var nextEvent = meetupDetails.next_event;

            if (nextEvent) {
              var nextEventDate = new Date(nextEvent.time);

              // Response to User
              this.emit(':ask', `The next ${cityMatch.city} Alexa developer meetup is on ${alexaDateUtil.getFormattedDate(nextEventDate)} at ${alexDateUtil.getFormattedTime(nextEventDate)}! Currently ${nextEvent.yes_rsvp_count} members have RSVP'd. How else can I help you?`, 'How can I help?');
            } else {
              this.emit(':ask', `There's currently no upcoming meetups in ${cityMatch.city}. You should ask the organizer, ${meetupDetails.organizer.name} to schedule one. How else can I help you?`, 'How can I help?');
            }

          })
          .catch((error) => {
            console.log('Meetup API ERROR', error);
            this.emit(':tell', `Sorry, there was a problem accessing your meetup account details.`);
          });
      } else {
        // Account Not Linked
        this.emit(':tellWithLinkAccountCard', `Please link your account to use this skill. I\'ve sent the details to your alexa app.`);
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
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
