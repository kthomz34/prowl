var request = require('request-promise');

module.exports = {

  GetGithubJobs: function() {
    return new Promise(function(resolve, reject) {
      // Call Github Jobs API
      request({
        url: 'https://jobs.github.com/positions.json',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response) {
        // Return Jobs Details
        resolve(JSON.parse(response));
      })
      .catch(function(error) {
        // API Error
        reject('Github Jobs API Error: ', error);
      });
    });
  },

  // GetGithubJobsByDescription: (description) => {
  //   return new Promise((resolve, reject) => {
  //     // Call Github Jobs API
  //     request({
  //       url: "https://jobs.github.com/positions.json?description="+ description,
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //     .then((response) => {
  //       // Return Jobs Details
  //       resolve(JSON.parse(response));
  //     })
  //     .catch((error) => {
  //       // API Error
  //       reject('Github Jobs API Error: ', error);
  //     });
  //   });
  // },

  GetGithubJobsByLocation: function (location) {
    return new Promise(function(resolve, reject) {
      // Call Github Jobs API
      request({
        url: "https://jobs.github.com/positions.json?description="+"&location="+location,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response) {
        // Return Jobs Details
        resolve(JSON.parse(response));
      })
      .catch(function(error) {
        // API Error
        reject('Github Jobs API Error: ', error);
      });
    });
  },

  // GetGithubJobsByDescriptionLocation: (description, location) => {
  //   return new Promise((resolve, reject) => {
  //     // Call Github Jobs API
  //     request({
  //       url: "https://jobs.github.com/positions.json?description="+ description +"&location="+ location,
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //     .then((response) => {
  //       // Return Jobs Details
  //       resolve(JSON.parse(response));
  //     })
  //     .catch((error) => {
  //       // API Error
  //       reject('Github Jobs API Error: ', error);
  //     });
  //   });
  // }
};
