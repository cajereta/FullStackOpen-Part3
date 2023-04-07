const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");



let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

///Middleware
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));



morgan.token("json", function (req, res) {
  return JSON.stringify(req.body);
});
// app.use(morgan(":method :url :status :res[content-length] :response-time ms :json"));



// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:", request.path);
//   console.log("Body:", request.body);
//   console.log("--------");
//   next();
// };

// app.use(requestLogger);

//Routes


app.get("/api/persons", (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts);
  });
});

app.get("/info", (request, response) => {
  Contact.find({})
    .then(result => {
      result.map(person => person.name);
      response.send(`<p>Phonebook has info for ${result.length} people.</p><br/> <p>${new Date()}</p>`);
    });

});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }

    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));

});

// app.post("/api/persons", (request, response) => {
//   const person = request.body;
//   person.id = (Math.random() * 100).toFixed(2);
//   if (!person.name) {
//     return response.status(400).json({
//       error: "Must provide a name"
//     });
//   } else if (persons.find(unique => unique.name === person.name)) {
//     return response.status(400).json({
//       error: "Names must be unique"
//     });
//   }
//   persons = persons.concat(person);
//   response.json(person);
// });

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: "phone number missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  });

  contact.save()
    .then(savecContact => {
      response.json(savecContact);
    })
    .catch(error => next(error));

});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then(updatedContact => {
      response.json(updatedContact);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});