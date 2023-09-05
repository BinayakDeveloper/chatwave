async function socket(io, jwt, SECRET_KEY, database) {
  io.on("connection", async (socket) => {
    let userToken = socket.handshake.auth.token;
    let verify = jwt.verify(userToken, SECRET_KEY);
    let user = await database.findById(verify._id);

    // Send Message To A Room
    socket.on("sendPrivateMessage", (data) => {
      socket.broadcast.emit("getPrivateMessage", data);
    });

    // Update Online Status In Database
    await user.updateOne({
      $set: { onlineStatus: true },
    });

    // Update User Status Frontend
    socket.broadcast.emit("updateStatus", { token: userToken });

    socket.on("disconnect", async () => {
      // Update Online Status In Database
      await user.updateOne({
        $set: { onlineStatus: false },
      });

      // Update Frontend
      socket.broadcast.emit("updateStatus", { token: userToken });
    });
  });
}

module.exports = socket;
