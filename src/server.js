const pool = require("./config/db");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const communityRoutes = require(
  "./routes/communityRoutes"
);

const postRoutes = require(
  "./routes/postRoutes"
);

const commentRoutes = require(
  "./routes/commentRoutes"
);

const likeRoutes = require(
  "./routes/likeRoutes"
);

const chatRoutes = require(
  "./routes/chatRoutes"
);

const nutritionRoutes = require(
  "./routes/nutritionRoutes"
);

const progressRoutes = require(
  "./routes/progressRoutes"
);

const permissionRoutes = require(
  "./routes/permissionRoutes"
);

const trainerRoutes = require(
  "./routes/trainerRoutes"
);

const messageRoutes = require(
  "./routes/messageRoutes"
);

const challengeRoutes = require(
  "./routes/challengeRoutes"
);

const analyticsRoutes = require(
  "./routes/analyticsRoutes"
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

app.use(
  "/api",
  likeRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/nutrition",
  nutritionRoutes
);

app.use(
  "/api/progress",
  progressRoutes
);

app.use(
  "/api/permissions",
  permissionRoutes
);

app.use(
  "/api/trainer",
  trainerRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/challenges",
  challengeRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FitSphere API Running"
  });
});

io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("joinCommunity", (communityId) => {

    socket.join(`community_${communityId}`);

    console.log(
      `User joined community ${communityId}`
    );
  });

  socket.on(
  "joinUserRoom",
  (userId) => {

    socket.join(
      `user_${userId}`
    );

    console.log(
      `User ${userId} joined personal room`
    );
  }
);

  socket.on(
    "sendMessage",
    async (data) => {

      try {

        const {
          communityId,
          userId,
          message
        } = data;

        const result = await pool.query(
          `
          INSERT INTO community_messages
          (community_id, user_id, message)
          VALUES
          ($1,$2,$3)
          RETURNING *
          `,
          [
            communityId,
            userId,
            message
          ]
        );

        io.to(
          `community_${communityId}`
        ).emit(
          "receiveMessage",
          result.rows[0]
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

  socket.on(
  "sendDirectMessage",
  async (data) => {

    try {

      const {
        senderId,
        receiverId,
        message
      } = data;

      const result = await pool.query(
        `
        INSERT INTO direct_messages
        (
          sender_id,
          receiver_id,
          message
        )
        VALUES
        ($1,$2,$3)
        RETURNING *
        `,
        [
          senderId,
          receiverId,
          message
        ]
      );

      io.to(
        `user_${receiverId}`
      ).emit(
        "receiveDirectMessage",
        result.rows[0]
      );

      io.to(
        `user_${senderId}`
      ).emit(
        "receiveDirectMessage",
        result.rows[0]
      );

    } catch (error) {

      console.error(error);

    }
  }
);

  socket.on(
    "disconnect",
    () => {
      console.log(
        "User disconnected"
      );
    }
  );
});

server.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});