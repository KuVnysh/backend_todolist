const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ToDoDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const toDoSchema = new mongoose.Schema({
  toDoTitle: String,
  toDoIsDone: Boolean,
  toDoStatus: {
    type: String,
    enum: ['ToDo', 'Done', 'Deleted'],
    default: 'ToDo'
  },
});

const ToDo = mongoose.model('ToDo', toDoSchema);

app.post('/api/todos', async (req, res) => {
  const { toDoTitle, toDoIsDone, toDoStatus } = req.body;

  const todo = new ToDo({
    toDoTitle,
    toDoIsDone,
    toDoStatus,
  });

  await todo.save();

  res.send(todo);
});

app.get('/api/todos', async (req, res) => {
  const todos = await ToDo.find();

  res.send(todos);
});

app.get('/api/todos/:id', async (req, res) => {
  const todo = await ToDo.findById(req.params.id);

  if (!todo) return res.status(404).send('ToDo is not found');

  res.send(todo);
});
app.put('/api/todos/:id', async (req, res) => {
  const todo = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!todo) return res.status(404).send('ToDo is not found');

  res.send(todo);
});
app.delete('/api/todos/:id', async (req, res) => {
  const todo = await ToDo.findByIdAndRemove(req.params.id);

  if (!todo) return res.status(404).send('ToDo is not found');

  res.send(todo);
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));