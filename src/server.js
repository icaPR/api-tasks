import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { readCSV } from "./middlewares/read-csv.js";

const fileCSVPath = new URL("tasks.csv", import.meta.url);

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    if (route.method === "POST") {
      const csvData = await readCSV(fileCSVPath);
      for (const data of csvData) {
        await route.handler(req, res, data);
      }
      return res.writeHead(201).end();
    }
    return route.handler(req, res);
  }

  return;
});

server.listen(3333);
