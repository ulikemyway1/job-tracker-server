const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: String,
  position: String,
  salary: String,
  status: String,
  note: String
});

module.exports = mongoose.model('Job', JobSchema);
