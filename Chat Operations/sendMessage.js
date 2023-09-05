async function sendMessage(req, res, chatDatabase, SECRET_KEY) {
  let { secret, sender, receiver, message, dateTime } = req.body;

  if (secret === SECRET_KEY) {
    let chatExistance1 = await chatDatabase.findOne({
      sender: sender,
      receiver: receiver,
    });

    let chatExistance2 = await chatDatabase.findOne({
      sender: receiver,
      receiver: sender,
    });

    if (chatExistance1 === null && chatExistance2 === null) {
      await chatDatabase({
        sender: sender,
        receiver: receiver,
        message: [
          {
            sender: sender,
            message: message,
            dateTime,
          },
        ],
      }).save();

      res.json({
        status: true,
        message: "Message Sent Successfully",
      });
    } else if (chatExistance1 !== null && chatExistance2 === null) {
      await chatExistance1.updateOne({
        $push: { message: { sender, message, dateTime } },
      });

      res.json({
        status: true,
        message: "Message Sent Successfully",
      });
    } else if (chatExistance1 === null && chatExistance2 !== null) {
      await chatExistance2.updateOne({
        $push: { message: { sender, message, dateTime } },
      });

      res.json({
        status: true,
        message: "Message Sent Successfully",
      });
    }
  } else if (secret.trim() === "") {
    res.json({
      status: false,
      message: "Please Provide Secret Key",
    });
  } else {
    res.json({
      status: false,
      message: "Invalid Secret Key",
    });
  }
}

module.exports = sendMessage;
