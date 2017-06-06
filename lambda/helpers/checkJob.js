module.exports = function checkJob(jobType) {

  var job;
  if (jobType) {
    job = jobType
  } else {
    job = null;
  }
  return job;
};
