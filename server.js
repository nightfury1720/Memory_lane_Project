const mongoose = require("mongoose");

const dotenv = require("dotenv");

const app = require("./app");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
  })
  .then((con) => {
    //console.log(con.connections);
    console.log("Database ka namaskar");
  });

const port = process.env.PORT || 2501;
const server = app.listen(port, () => {
  console.log(`Aap sabko port ${port} ka namaskar`);
});
