// const request = require('request');
// const assert = require('assert');
// const baseUrl = "http://localhost:3001";
// const expect = require('chai').expect;

// //include tested files
// const job = require('../api/job/job');

process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectID;
const User = require('../models/user');
const Job = require('../models/job');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

const getAppliedUserNotApplied = {
  phoneNumber: 6043347758
};
const getAppliedUserApplied = {
  phoneNumber: 6043388885
};
const canApplyAlreadyAppliedUser = {
  userID: "dummy"
};
const canApplyAlreadyAppliedJob = {
  jobID: "dummy"
};
const canApplyIsCreatorUser = {
  userID: "dummy"
};
const canApplyIsCreatorJob = {
  jobID: "dummy"
};
const canApplyCorrectUser = {
  userID: "dummy"
};
const canApplyCorrectJob = {
  jobID: "dummy"
};

/**
 * Tests for Get Employer Job.
 */
describe("Get Employer Job.", function () {
  var url = "/get-employer-jobs";
  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /** 1)
   * Test Case: Success Case
   * Input/Output: Pass a NULL request user  parameter.
   * Pass/Fail Criteria: Only succeeds if it returns
   *                     code (200) with no error messages
   */
  it('Test Case: Success Case', (done) => {
    // create a dummy employer
    var dEmployer = new User();
    dEmployer.first_name = "dummy";
    dEmployer.last_name = "dummy";
    dEmployer.phone_number = "hasapplied";
    dEmployer.hash_password = "dummy";
    dEmployer.verification_token = undefined;
    dEmployer.working_job_id = undefined;
    dEmployer.is_working = false;
    dEmployer.is_verified = false;
    dEmployer.is_employer = false;
    dEmployer.images = [];

    // save the dEmployer
    dEmployer.save((err) => {
      return;
    });
    
    var job = new Job();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save((err) => {
      return;
    });

    chai.request(server).get(url).query({employer: dEmployer._id.toString()}).end((err, res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('errorMessage');
      res.body.should.be.a('array');
      res.body.should.have.length.eql(1);
      done();
    });
  });
});

/**
 * Tests for Apply for a job.
 */
describe("Apply for a job.", function () {
  var url = "/job/apply";
  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /** 1)
   * Test Case: Success Case
   * Input/Output: Pass a NULL request user  parameter.
   * Pass/Fail Criteria: Only succeeds if it returns
   *                     code (200) with no error messages
   */
  it('Test Case: Success Case', (done) => {
    // create a dummy employer
    var dEmployer = new User();
    dEmployer.first_name = "dummy";
    dEmployer.last_name = "dummy";
    dEmployer.phone_number = "hasapplied";
    dEmployer.hash_password = "dummy";
    dEmployer.verification_token = undefined;
    dEmployer.working_job_id = undefined;
    dEmployer.is_working = false;
    dEmployer.is_verified = false;
    dEmployer.is_employer = false;
    dEmployer.images = [];

    // save the dEmployer
    dEmployer.save((err) => {
      return;
    });
    
    var job = new Job();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save((err) => {
      return;
    });

    // create a new user
    var user = new User();
    user.first_name = "dummy";
    user.last_name = "dummy";
    user.phone_number = "hasapplied";
    user.hash_password = "dummy";
    user.verification_token = undefined;
    user.working_job_id = undefined;
    user.is_working = false;
    user.is_verified = false;
    user.is_employer = false;
    user.images = [];

    // save the user
    user.save((err) => {
      return;
    });

    chai.request(server).post(url).send({jobID: job._id.toString(), userID: user._id.toString()}).end((err, res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('errorMessage');
      done();
    });
  });
});

/**
 * Tests for Get Applied-For Jobs.
 */
describe("Get Applied-For Jobs", function () {
  var url = "/job/get-taken-jobs";
  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /** 1)
   * Test Case: Null user
   * Input/Output: Pass a NULL request user  parameter.
   * Pass/Fail Criteria: Only succeeds if it returns error
   *                     code (400) with the message "User is a required field”.
   */
  it('Test Case: Null user', (done) => {
    chai.request(server).get(url).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('message').eql('User is a required field');
      done();
    });
  });

  /**
   * 2)
   * Test Case: Applicant has not applied for any jobs
   * Input/Output: Send a request with a user phone _number
   *               that has not applied to any job.
   * Pass/Fail Criteria: Only succeeds if it returns error code
   *                     (400) with error message "User has not applied to any jobs”.
   */
  it('Test Case: Applicant has not applied for any jobs', (done) => {
    // create a new user
    var user = new User();
    user.first_name = "dummy";
    user.last_name = "dummy";
    user.phone_number = "hasnotapplied";
    user.hash_password = "dummy";
    user.verification_token = undefined;
    user.working_job_id = undefined;
    user.is_working = false;
    user.is_verified = false;
    user.is_employer = false;
    user.images = [];

    // save the user
    user.save(function (err) {
      return;
    });
    
    chai.request(server).get(url).query({employeeID: user._id.toString()}).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('errorMessage').eql('User has not applied to any jobs');
      done();
    });
  });

  /**
   * 3)
   * Test Case: Successfully create a user, apply for a few
   *            jobs and send a request to get those jobs.
   * Input/Output: Send a request with a user phone _number
   *               that has not applied to any job.
   * Pass/Fail Criteria: Only succeeds if it returns code (200) with
   *                     no error message and an array of correct expected jobs.
   */
  it("Test Case: Applicant has applied for any jobs", (done) => {
    // create a new user
    var user = new User();
    user.first_name = "dummy";
    user.last_name = "dummy";
    user.phone_number = "hasapplied";
    user.hash_password = "dummy";
    user.verification_token = undefined;
    user.working_job_id = undefined;
    user.is_working = false;
    user.is_verified = false;
    user.is_employer = false;
    user.images = [];

    // save the user
    user.save((err) => {
      return;
    });
        
    var job = new Job();
    var dEmployer = new User();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;

    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;
    let applicants = [];
    applicants.push(user._id);
    job.applicants = applicants;
    // save the job
    job.save((err) => {
      return;
    });
    
    chai.request(server).get(url).query({employeeID: user._id.toString()}).end((err, res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('errorMessage');
      done();
    });
    
  });
});

/**
 * Tests for Get All jobs.
 */
describe("Get Applied-For Jobs", function () {
  var url = "/get-all-jobs";
  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /** 1)
   * Test Case: Success case
   * Input/Output: Send a request to get all jobs in the database.
   *               Now, this should return and array that includes
   *               as many jobs as there is in the database, one test
   *               case could be successfully adding some jobs, and then
   *               asserting that the number of returned jobs is at least
   *               equal to the number of added jobs.
   * Pass/Fail Criteria: Only succeeds if it returns code (200) and no error
   *                     message. The returned array should have at least as
   *                     many jobs as successfully added to the database.
   */
  it("Test Case: Success case", (done) => {
    var job = new Job();
    var dEmployer = new User();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save((err) => {
      return;
    });
    
    chai.request(server).get(url).end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(1);
      res.body.should.not.have.property('errorMessage');
      done();
    });
    
  });

});

/**
 * Tests for User Is Able To Apply.
 */
describe("User Is Able To Apply", function () {
  var url = "/job/can-apply";
  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /** 1)
   * Test Case: Null user
   * Input/Output: Pass a NULL request user  parameter.
   * Pass/Fail Criteria: Only succeeds if it returns error code (400) with the message
   *                     “User is a required field”
   */
  it("Test Case: Null user", (done) => {
    var job = new Job();
    var dEmployer = new User();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save((err) => {
      return;
    });
    chai.request(server).get(url).query({jobID: "dummy"}).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('errorMessage').eql('User is a required field');
      done();
    });
    
  });


  /** 2)
   * Test Case: Null job
   * Input/Output: Pass a NULL request job parameter.
   * Pass/Fail Criteria: Only succeeds if it returns error code (400) with the message
   *                     "Job is a required field”
   */
    it("Test Case: Null Null job", (done) => {
      chai.request(server).get(url).query({userID: "dummy"}).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('errorMessage').eql('User is a required field');
        done();
      });
    });

  /**
   * 3)
   * Test Case: User has already applied to this job.
   * Input/Output: Send a request with a user phone _number that has
   *               already applied to this job.
   * Pass/Fail Criteria: Only succeeds if it returns code (400) with error
   *                     message "You have already applied to this job"
   */
  it("Correct application form", function (done) {
    // create a dummy employer
    var dEmployer = new User();
    dEmployer.first_name = "dummy";
    dEmployer.last_name = "dummy";
    dEmployer.phone_number = "hasapplied";
    dEmployer.hash_password = "dummy";
    dEmployer.verification_token = undefined;
    dEmployer.working_job_id = undefined;
    dEmployer.is_working = false;
    dEmployer.is_verified = false;
    dEmployer.is_employer = false;
    dEmployer.images = [];

    // create a new user
    var dEmployee = new User();
    dEmployee.first_name = "dummy";
    dEmployee.last_name = "dummy";
    dEmployee.phone_number = "hasapplied";
    dEmployee.hash_password = "dummy";
    dEmployee.verification_token = undefined;
    dEmployee.working_job_id = undefined;
    dEmployee.is_working = false;
    dEmployee.is_verified = false;
    dEmployee.is_employer = false;
    dEmployee.images = [];

    // save the dEmployee
    dEmployee.save((err) => {
      return;
    });

    // save the dEmployer
    dEmployer.save((err) => {
      return;
    });
    
    var job = new Job();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;
    job.applicants = [];
    job.applicants.push(dEmployee._id);

    // save the job
    job.save((err) => {
      return;
    });
    
    chai.request(server).get(url).query({userID: dEmployee._id.toString(), jobID: job._id.toString()}).end((err, res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('errorMessage');
      done();
    });
  });

//   /**
//    * 4)
//    * Test Case: User is the creator of this job.
//    * Input/Output: Send a request with a user phone _number that
//    *               is the creator of the same job.
//    * Pass/Fail Criteria: Only succeeds if it returns code (400) with error
//    *                     message "You can't apply to your own job"
//    */
  it("User is the creator of this job", function (done) {
    // create a dummy employer
    var dEmployer = new User();
    dEmployer.first_name = "dummy";
    dEmployer.last_name = "dummy";
    dEmployer.phone_number = "hasapplied";
    dEmployer.hash_password = "dummy";
    dEmployer.verification_token = undefined;
    dEmployer.working_job_id = undefined;
    dEmployer.is_working = false;
    dEmployer.is_verified = false;
    dEmployer.is_employer = false;
    dEmployer.images = [];

    // save the dEmployer
    dEmployer.save((err) => {
      return;
    });
    
    var job = new Job();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save((err) => {
      return;
    });
    
    chai.request(server).get(url).query({userID: dEmployer._id.toString(), jobID: job._id.toString()}).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property("errorMessage").eql("You can't apply to your own job");
      done();
    });
  });

  /**
   * 5)
   * Test Case: Correct application form.
   * Input/Output: Send a request with a correct phone_number that
   *               is neither an employer nor a previous applicant of this job.
   * Pass/Fail Criteria: Only succeeds if it returns code (200) with
   *                     no error messages.
   */
  it("Correct application form", function (done) {
    // create a dummy employer
    var dEmployer = new User();
    dEmployer.first_name = "dummy";
    dEmployer.last_name = "dummy";
    dEmployer.phone_number = "hasapplied";
    dEmployer.hash_password = "dummy";
    dEmployer.verification_token = undefined;
    dEmployer.working_job_id = undefined;
    dEmployer.is_working = false;
    dEmployer.is_verified = false;
    dEmployer.is_employer = false;
    dEmployer.images = [];

    // save the dEmployer
    dEmployer.save((err) => {
      return;
    });
    
    var job = new Job();
    job.job_title = "dummy";
    job.description = "dummy";
    job.wage = 0;
    job.address = "dummy";
    job.employer = dEmployer._id;
    job.employee = undefined;
    job.created_at = new Date();
    job.deleted_at = undefined;
    job.is_deleted = false;
    job.is_compeleted = false;
    job.is_active = false;

    // save the job
    job.save((err) => {
      return;
    });

    // create a new user
    var user = new User();
    user.first_name = "dummy";
    user.last_name = "dummy";
    user.phone_number = "hasapplied";
    user.hash_password = "dummy";
    user.verification_token = undefined;
    user.working_job_id = undefined;
    user.is_working = false;
    user.is_verified = false;
    user.is_employer = false;
    user.images = [];

    // save the user
    user.save((err) => {
      return;
    });
    
    chai.request(server).get(url).query({userID: user._id.toString(), jobID: job._id.toString()}).end((err, res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('errorMessage');
      done();
    });
  });
});


/**
 * Tests for Create Job.
 */
describe("Create Job", function () {
  var url = "/create-job";
  beforeEach((done) => {
    Job.deleteMany({}, (err) => {
      done();
    });
  });
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /**
  * 1)
  * Test Case: Null job.
  * Input/Output: Pass a NULL request parameter.
  * Pass/Fail Criteria: Only succeeds if it returns error code
  *                     (400) with the message “All fields have not been filled out”.
  */
  it("Test Case: Null job", (done) => {
    chai.request(server).post(url).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('errorMessage').eql('All fields have not been filled out');
      done();
    });
  });

//   /**
//   * 2)
//   * Test Case: No job_title.
//   * Input/Output: Pass a NULL job title parameter.
//   * Pass/Fail Criteria: Only succeeds if it returns error code
//   *                     (400) with the message “All fields have not been filled out”.
//   */
//   it("No job_title", function (done) {
//     let options = {};
//     request(baseUrl + url, options, function (err, res, body) {
//       expect(res.statusCode)
//         .to
//         .equal(400);
//       expect(body.errorMessage)
//         .to
//         .equal("All fields have not been filled out");
//       done();
//     });
//   });

//   /**
//  * 3)
//  * Test Case: No job_description.
//  * Input/Output: Pass a NULL job_description.
//  * Pass/Fail Criteria: Only succeeds if it returns error code
//  *                     (400) with the message “All fields have not been filled out”.
//  */
//   it("No job_description", function (done) {
//     let options = {
//       job_title: "dummy"
//     };
//     request(baseUrl + url, options, function (err, res, body) {
//       expect(res.statusCode)
//         .to
//         .equal(400);
//       expect(body.errorMessage)
//         .to
//         .equal("All fields have not been filled out");
//       done();
//     });
//   });

//   /**
//  * 4)
//  * Test Case: No wage.
//  * Input/Output: Pass a NULL wage.
//  * Pass/Fail Criteria: Only succeeds if it returns error code
//  *                     (400) with the message “All fields have not been filled out”.
//  */
//   it("No wage", function (done) {
//     let options = {
//       job_title: "dummy",
//       job_description: "dummy"
//     };
//     request(baseUrl + url, options, function (err, res, body) {
//       expect(res.statusCode)
//         .to
//         .equal(400);
//       expect(body.errorMessage)
//         .to
//         .equal("All fields have not been filled out");
//       done();
//     });
//   });

//   /**
//  * 5)
//  * Test Case: No address.
//  * Input/Output: Pass a no address.
//  * Pass/Fail Criteria: Only succeeds if it returns error code
//  *                     (400) with the message “All fields have not been filled out”.
//  */
//   it("No address", function (done) {
//     let options = {
//       job_title: "dummy",
//       job_description: "dummy",
//       wage: 10
//     };
//     request(baseUrl + url, options, function (err, res, body) {
//       expect(res.statusCode)
//         .to
//         .equal(400);
//       expect(body.errorMessage)
//         .to
//         .equal("All fields have not been filled out");
//       done();
//     });
//   });

//   /**
//  * 6)
//  * Test Case: No employer ID.
//  * Input/Output: Pass a no employer ID.
//  * Pass/Fail Criteria: Only succeeds if it returns error code
//  *                     (400) with the message “All fields have not been filled out”.
//  */
//   it("No employer ID", function (done) {
//     let options = {
//       job_title: "dummy",
//       job_description: "dummy",
//       wage: 10,
//       address: "9832 wain street"
//     };
//     request(baseUrl + url, options, function (err, res, body) {
//       expect(res.statusCode)
//         .to
//         .equal(400);
//       expect(body.errorMessage)
//         .to
//         .equal("All fields have not been filled out");
//       done();
//     });
//   });

//   /**
//  * 7)
//  * Test Case: Zero wage.
//  * Input/Output: Pass a zero  wage.
//  * Pass/Fail Criteria: Only succeeds if it returns error code
//  *                     (400) with the message "Employees won't work for free!”.
//  */
  it("Test Case: Zero wage", (done) => {
    var dEmployer = new User();
    let job = {};
      job.employerID = "dummy";
      job.jobType = "dummy";
      job.description = "dummy";
      job.wage = 0;
      job.address = "dummy";

    chai.request(server).post(url).send(job).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property("errorMessage").eql("Employees won't work for free!");
      done();
    });
  });

  /**
 * 8)
 * Test Case: Negative wage.
 * Input/Output: Pass a negative  wage.
 * Pass/Fail Criteria: Only succeeds if it returns error code
 *                     (400) with the message "Woah! employees won't work AND pay you money!”.
 */
  it("Test Case: Zero wage", (done) => {
    var dEmployer = new User();
    let job = {};
      job.employerID = "dummy";
      job.jobType = "dummy";
      job.description = "dummy";
      job.wage = -1;
      job.address = "dummy";

    chai.request(server).post(url).send(job).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property("errorMessage").eql("Woah! employees won't work AND pay you money!");
      done();
    });
  });

  /**
  * 9)
  * Test Case: Success Case.
  * Input/Output: Pass a NULL request parameter.
  * Pass/Fail Criteria: Only succeeds if it returns error code
  *                     (400) with the message “All fields have not been filled out”.
  */
  it("Test Case: Success Case", (done) => {
    // create a valid user
    var dEmployer = new User();
    let job = {
      employerID: dEmployer._id.toString(),
      jobType: "dummy",
      description: "dummy",
      wage: 1,
      address: "dummy"
    };

    chai.request(server).post(url).send(job).end((err, res) => {
      res.should.have.status(200);
      res.body.should.not.have.property('errorMessage');
      res.body.should.be.a('object');
      res.body.should.have.property('job_title');
      done();
    });
  });

});