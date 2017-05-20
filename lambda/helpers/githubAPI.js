var request = require('request-promise');

module.exports = {

  GetGithubJobs: () => {
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
