async function allUsers(req, res, SECRET_KEY, database) {
  let { secret } = req.body;
  if (secret === SECRET_KEY) {
    let users = await database.find({});
    if (users.length !== 0) {
      res.json({
        status: true,
        users,
      });
    } else {
      res.json({
        status: false,
        message: "No User Found",
      });
    }
  } else if (secret.trim() === "") {
    res.json({
      status: false,
      message: "Provide The Secret Key",
    });
  } else {
    res.json({
      status: false,
      message: "Invalid Secret Key",
    });
  }
}

module.exports = allUsers;
