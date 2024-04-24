import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res, csvData) => {
      let task;
      if (csvData) {
        task = {
          id: randomUUID(),
          title: csvData.title,
          description: csvData.description,
          completed_at: null,
          created_at: new Date(),
          updated_at: null,
        };
      } else {
        const { title, description } = req.body;
        task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: null,
        };
      }

      database.insert("tasks", task);
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id;
      const data = req.body;
      database.update("tasks", id, data);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const id = req.params.id;
      database.update_status("tasks", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const id = req.params.id;
      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
];
