const express = require("express");
const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

const path = require("path");

const PORT = 3000;

// Serve the HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Store total upvotes
let upvote_count = 0;

// Socket connection
io.on("connection", (socket) => {

    console.log("A user has connected!");

    // Receive upvote event
    socket.on("upvote-event", (upvote_flag) => {

        if (upvote_flag) {
            upvote_count++;
        } else {
            upvote_count--;
        }

        // Prevent negative votes
        if (upvote_count < 0) {
            upvote_count = 0;
        }

        const f_str =
            upvote_count +
            " " +
            (upvote_count === 1 ? "Upvote" : "Upvotes");

        // Send updated count to every connected client
        io.emit("update-upvotes", f_str);

    });

    // Disconnect event
    socket.on("disconnect", () => {

        console.log("User disconnected");

    });

});

// Start server
http.listen(PORT, () => {

    console.log(`Listening on http://localhost:${PORT}`);

});