module.exports = function checkJob(jobType) {

  var job;
  if (jobType) {
    job = jobType
  } else {
    this.emit(':ask', 'Sorry, I didn\'t recognise that job type.', 'How can I help?');
  }
  return job;
};
