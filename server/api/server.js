const auth = require("json-server-auth");
const jsonServer = require("json-server");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

global.io = io;
const fs = require("fs");
const os = require("os");
const path = require("path");
fs.copyFile("db.json", os.tmpdir() + "/db.json", function (err) {
  if (err) console.log(err);
  else console.log("copy file succeed to" + os.tmpdir());
});
const router = jsonServer.router(path.resolve(os.tmpdir() + "/db.json"));

// response middleware
router.render = (req, res) => {


    res.json(res.locals.data);
};

const middlewares = jsonServer.defaults();
const port = process.env.PORT || 9000;

// Bind the router db to the app
app.db = router.db;

app.use(middlewares);

const rules = auth.rewriter({
    users: 640,
    team: 660,
    projects: 660,
});

app.use(rules);
app.use(auth);
app.use(router);

server.listen(port);


