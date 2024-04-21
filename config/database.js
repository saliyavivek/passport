const mongoose = require("mongoose");

main()
  .then(console.log("connected to db"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
