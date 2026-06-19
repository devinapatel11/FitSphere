const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

const communityRoutes = require(
  "./routes/communityRoutes"
);

const postRoutes = require(
  "./routes/postRoutes"
);

const commentRoutes = require(
  "./routes/commentRoutes"
);

app.use(cors());
app.use(express.json());




app.use("/api/auth", authRoutes);

app.use(
  "/api/communities",
  communityRoutes
);
app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api",
  commentRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FitSphere API Running"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});