const app = require("./app");

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

process.on("SIGINT", () => {
  console.log("Stopping server");
  server.close();
  process.exit();
});
