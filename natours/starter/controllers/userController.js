const fs = require('fs');

const dataFilePath = `${__dirname}/../dev-data/data`;
const users = JSON.parse(fs.readFileSync(`${dataFilePath}/users.json`));

exports.getAllUsers = (req, res) => {
  res.status(200).json({ status: 'success', data: users });
};

exports.createUser = (req, res) => {
  res.status(500).json({ status: 'failed', data: 'Route not yet defined' });
};

exports.getUser = (req, res) => {
  const id = req.params['id'];
  const user = users.find((user) => user._id == id);

  if (!user) {
    res.status(404).json({ status: 'failed', message: 'invalid ID' });
    return;
  }

  res.status(200).json({ status: 'success', data: { user } });
};

exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'failed', message: 'Route not yet defined' });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'failed', message: 'Route not yet defined' });
};

