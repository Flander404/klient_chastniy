const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// allRouter

var usersRouter = require("./routes/usersRouter.js");
var lisoRouter = require("./routes/lisoRouter.js");
var zakazRouter = require("./routes/zakazRouter.js");
var banRouter=require("./routes/banRouter.js")
var likeUserRouter=require("./routes/likeUserRouter.js")

var contactsRouter = require("./routes/contactsRouter.js");
var companiesRouter = require("./routes/companiesRouter.js");
var blogCategoriesRouter = require("./routes/blogCategoriesRouter.js");
var blogsRouter = require("./routes/blogsRouter.js");
var documentRouter = require("./routes/documentRouter.js");
var hamkasbRouter = require("./routes/hamkasbRouter.js");
var aktiRouter = require("./routes/aktiRouter.js");
var vigruzkaRouter = require("./routes/vigruzkaRouter.js");
var balanseRouter = require("./routes/balanseRouter.js");
var ispolzeRouter = require("./routes/ispolzeRouter.js");
var schetaRouter = require("./routes/schetaRouter.js");

var blogCategoryConnectRouter = require("./routes/blogCategoryConectRouter.js");
const cors = require("cors");
const fs = require("fs");
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("./uploads"));
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded verileri için

app.use("/api", zakazRouter);
app.use("/api", usersRouter);
app.use("/api", lisoRouter);
app.use("/api", contactsRouter);
app.use("/api", companiesRouter);
app.use("/api", blogCategoriesRouter);
app.use("/api", blogsRouter);
app.use("/api", blogCategoryConnectRouter);
app.use("/api", hamkasbRouter);
app.use("/api", aktiRouter);
app.use("/api", vigruzkaRouter);
app.use("/api", balanseRouter);
app.use("/api", documentRouter);
app.use("/api", ispolzeRouter);
app.use("/api", schetaRouter);
app.use('/api',banRouter)
app.use('/api',likeUserRouter)
app.get("/doc", (_req, res) => {
  const data = fs.readFileSync("./uploads/index.html", {
    encoding: "utf8",
    flag: "r",
  });
  res.status(200).send(data);
});
// Create an HTTP server

app.listen(4003, () => {
  console.log("Сервер запущен");
  console.log("server started");
});
