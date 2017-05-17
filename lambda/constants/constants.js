var constants = Object.freeze({


  appId: 'amzn1.ask.skill.8ade3603-32d7-447c-b2ba-1f1a7b654341',

  // DynamoDB Table Name
  dynamoDBTableName : 'GroupFinderUsers',

  // Skill States
  states: {
    ONBOARDING: '',
    MAIN: '_MAIN'
  }

});

module.exports = constants;
