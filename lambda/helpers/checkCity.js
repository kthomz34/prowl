module.exports = function checkCity(USCitySlot, EuropeanCitySlot) {

  // Get city
  var city;
  if (USCitySlot) {
    city = USCitySlot;
  } else if (EuropeanCitySlot) {
    city = EuropeanCitySlot;
  } else {
    city = null
  }
  return city;
};
