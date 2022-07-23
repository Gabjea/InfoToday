const server = require("./app");

const port = process.env.SERVER_PORT || 3001;
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});