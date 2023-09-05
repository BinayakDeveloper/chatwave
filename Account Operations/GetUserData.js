async function getUserData(req, res, SECRET_KEY, jwt, database) {
  let { token, secret } = req.body;
  if (secret === SECRET_KEY) {
    let verify = await jwt.verify(token, SECRET_KEY);
    let user = await database.findById(verify._id);
    if (user !== null) {
      res.json({
        status: true,
        id: user._id,
        uid: user.uid,
        username: user.username,
        email: user.email,
        onlineStatus: user.onlineStatus,
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

module.exports = getUserData;
