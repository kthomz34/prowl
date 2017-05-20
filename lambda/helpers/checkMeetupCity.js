var githubCities = require('../data/githubCities');

module.exports = function checkgithubCity(USCitySlot, EuropeanCitySlot) {

  // Get city
  var city;
  if (USCitySlot) {
    city = USCitySlot;
  } else if (EuropeanCitySlot) {
    city = EuropeanCitySlot;
  }

  // Check for our city
  var cityMatch = false;
  for (var i = 0; i < githubCities.length; i++) {
    if (githubCities[i].city.toLowerCase() === city.toLowerCase()){
      cityMatch = githubCities[i];
    }
  }

  return cityMatch;
};
