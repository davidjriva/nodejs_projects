const fs = require('fs');
const express = require('express');

// Read in tours data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Route Handlers
const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params['id'];

  const tour = tours.find((t) => t.id == id);

  if (!tour) {
    res.status(404).json({ status: 'failed', message: 'invalid ID' });
    return;
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-dev.json`, JSON.stringify(tours), (err) => {
    console.log(err);
  });

  res.status(201).json({ status: 'success', data: { tour: newTour } });
};

const updateTour = (req, res) => {
  res.status(200).json({ status: 'success', data: { tour: '<updated tour here>' } });
};

const deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

// Instantiate the express object
const app = express();

// Middleware: A function capable of modifying incoming request data.
// Adds the body into the request object as JSON.
app.use(express.json());

// API development endpoints
app.route('/api/v1/tours')
    .get(getTours)
    .post(createTour);
app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// Starting a server:
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
