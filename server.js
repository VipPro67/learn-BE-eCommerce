const app = require("./src/app");

const server = app.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

process.on("SIGINT", () => {
  console.log("Stopping server");
  server.close();
  process.exit();
});
