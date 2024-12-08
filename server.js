require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Job = require('./models/Job');

const app = express();
app.use(cors());
app.use(express.json());

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });


app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/jobs', async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

app.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

app.get('/jobs/paginated', async (req, res) => {
  try {
    const total = await Job.countDocuments();
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const jobs = await Job.find().sort({ _id: -1 }).skip(skip).limit(limit);
    res.json({ total, jobs });
  } catch {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

