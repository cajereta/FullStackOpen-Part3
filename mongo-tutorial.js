const mongoose = require("mongoose");

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log('give password as argument and the contact you want to add!');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://cajereta:${password}@test-phonebook-fso.3zo9kj6.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact);
    });
    mongoose.connection.close();
    process.exit(0);
  });
}

if (process.argv.length !== 3) {
  const name = process.argv[3];
  const numberContact = process.argv[4];

  const contact = new Contact({
    name: name,
    number: numberContact,
  });

  contact.save().then(result => {
    console.log(`Added ${name} with number ${numberContact} to phonebook`);
    mongoose.connection.close();
  });
}



