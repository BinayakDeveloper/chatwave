async function retriveChats(req, res, SECRET_KEY, chatDatabase) {
  let { secret, sender, receiver } = req.body;
  if (secret === SECRET_KEY) {
    let chatsExistance1 = await chatDatabase.find({ sender, receiver });
    let chatsExistance2 = await chatDatabase.find({
      sender: receiver,
      receiver: sender,
    });

    if (chatsExistance1.length === 0 && chatsExistance2.length === 0) {
      res.json({
        status: false,
        message: "Start A New Conversation",
      });
    } else if (chatsExistance1.length !== 0 && chatsExistance2.length === 0) {
      res.json({
        status: true,
        chats: chatsExistance1[0].message,
      });
    } else {
      res.json({
        status: true,
        chats: chatsExistance2[0].message,
      });
    }
  } else if (secret.trim() === "") {
    res.json({ status: false, message: "Please provide the secret key" });
  } else {
    res.json({ status: false, message: "Invalid Secret Key" });
  }
}

module.exports = retriveChats;
