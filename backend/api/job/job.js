var Job = require('../../models/job');
var database = require('../../populatedb');

module.exports = {
  getAllJobs(req, res) {
    let ret = {};
    var userList = [];
    var i = 0;  
    Job.find({}, function(err, users) {
      if (err){
        return res.status(500).send(ret);
      }
      users.forEach(function(user) {
        userList[i] = user;
        i++;
      });
      return res.status(200).send(userList); 
    });
  },
  
  createJob(req, res) {
    let ret = {};
    var job = new Job();
    // if a field is missing return an error
    if (!req.body || !req.body.job_title || !req.body.description || !req.body.wage
      || !req.body.address || !req.body.employer) {
      ret.errorMessage = 'All fields have not been filled out';
      return res.status(400).send(ret);
    }
    
    job.job_title = req.body.jobType;
    job.description = req.body.description;
    job.wage = req.body.wage;
    job.address = req.body.address;
    job.employer = employerID;

    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save(function (err) {
        console.log("reached");
        if (err) {
          ret.errorMessage = err.message;
          return res.status(500).send(ret);
        }
        console.log('New User: ' + job);
        return res.status(200).send(job);
    });
  },
  
  getEmployerJobs(req, res) {
    let ret = {};
    var userList = [];
    var i = 0;  
    Job.find({employer : res.body.employer}, function(err, users) {
      if (err){
        return res.status(500).send(ret);
      }
      users.forEach(function(user) {
        userList[i] = user;
        i++;
      });
      return res.status(200).send(userList); 
    });
  }
}