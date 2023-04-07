require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;

mongoose.connect(url)
  .then(result => { console.log('connected to MongoDB'); })
  .catch((error) => { console.log('error connecting to MongoDB:', error.message); });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{6,}/.test(v);
      },
      message: props => `${props.value} is not a valid number!`
    },
    minLength: 6,
    required: true
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Contact", contactSchema);