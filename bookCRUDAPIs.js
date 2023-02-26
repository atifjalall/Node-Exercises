const express = require("express");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT;
const app = express();
const Joi = require("joi");
app.use(express.json());
const crypto = require("crypto");

let generateID = () => {
  const randomBytes = crypto.randomBytes(16);

  const id = randomBytes
    .toString("base64")
    .replace(/[+\/=]/g, "")
    .substring(0, 16);
  const hashedID = crypto.createHash("sha256").update(id).digest("hex");

  return hashedID;
};

const books = [
  {
    id: "3df0be47447a0c3e7066b56dda1b74b06efb1712c961103b26c23484c8605a30",
    title: "Maths",
    author: "Atif Jalal",
    publicationDate: "1979-10-12T00:00:00.000Z",
    price: 10.86,
  },
  {
    id: "bb702b265e0e0cf28bbe1d01c2fb72dc0e11f3fa8fc37fa22c2f7931fa644158",
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    publicationDate: "1979-10-12T00:00:00.000Z",
    price: 12.99,
  },
];

let validateUser = (book) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    author: Joi.string().min(5).required(),
    publicationDate: Joi.date().required(),
    price: Joi.number().required(),
  });
  return schema.validate(book);
};

app.get("/", (req, res) => {
  res.send("Welcome to our book store");
});

app.get("/books", (req, res) => {
  res.send(books);
});

app.post("/books", (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { title, author, publicationDate, price } = req.body;
  const book = {
    id: generateID(),
    title: title,
    author: author,
    publicationDate: publicationDate,
    price: price,
  };

  books.push(book);
  res.send(book);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((item) => item.id === req.params.id);
  !book ? res.status(404).send("Book does not exist!") : res.send(book);
});

app.put("/books/:id", (req, res) => {
  const book = books.find((item) => item.id === req.params.id);
  if (!book) {
    return res.status(404).send("Book does not exist!");
  }

  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { title, author, publicationDate, price } = req.body;
  book.title = title;
  book.author = author;
  book.publicationDate = publicationDate;
  book.price = price;
  res.send(book);
});

app.delete("/books/:id", (req, res) => {
  const bookIndex = books.findIndex((item) => item.id === req.params.id);
  if (bookIndex === -1) {
    return res.status(404).send("Book does not exist!");
  }
  books.splice(bookIndex, 1);
  res.send(`Book Deleted with ID: ${req.params.id}`);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
