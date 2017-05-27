module.exports = function checkCity(USCitySlot, EuropeanCitySlot) {

  // Get city
  var city;
  if (USCitySlot) {
    city = USCitySlot;
  } else if (EuropeanCitySlot) {
    city = EuropeanCitySlot;
  } else {
    this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
  }
  return city;
};
