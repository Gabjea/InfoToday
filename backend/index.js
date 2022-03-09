const server = require("./app");

const port = process.env.SERVER_PORT || 5000;
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});