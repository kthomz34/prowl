var request = require('request-promise');

module.exports = {

  GetCityJobCount: () => {
    return new Promise((resolve, reject) => {
      // Call Github Jobs API
      request({
        url: "https://jobs.github.com/positions.json",
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        // Return Users Details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        // API Error
        reject('Github Jobs API Error: ', error);
      });
    });
  }
};


  // GetMeetupGroupDetails: (accessToken, meetupURL) => {
  //   return new Promise((resolve, reject) => {
  //     request({
  //       url: "https://api.meetup.com/"+meetupURL,
  //       qs: {
  //         access_token: accessToken,
  //         'photo-host': 'secure',
  //         fields: 'next_event,last_event,plain_text_description'
  //       },
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Meta-Photo-Host': 'secure'
  //       }
  //     })
  //     .then((response) => {
  //       // Return MEttup Group Details
  //       resolve(JSON.parse(response));
  //     })
  //     .catch((error) => {
  //       // API Error
  //       reject('Meetup API Error: ', error);
  //     });
  //   });
  // }
