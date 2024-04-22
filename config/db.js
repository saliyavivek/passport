const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

main()
  .then(console.log("connected to db"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
