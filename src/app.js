const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    techs,
    url,
    likes: 0,
  };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const project = {
    id: repositories[projectIndex].id,
    title,
    techs,
    url,
    likes: repositories[projectIndex].likes,
  }

  repositories[projectIndex] = project;

  return response.json(project);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Project not found.' });
  }

  repositories.splice(projectIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  repositories[projectIndex].likes = repositories[projectIndex].likes + 1;

  return response.json({ likes: repositories[projectIndex].likes });
});

module.exports = app;
