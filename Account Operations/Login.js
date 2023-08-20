async function Login(req, res, database, bcrypt) {
  let { email, password } = req.body;
  let user = await database.findOne({ email });
  if (user != null) {
    let dbPassword = user.password;
    let passwordCompare = await bcrypt.compare(password, dbPassword);
    if (passwordCompare) {
      res.json({
        status: true,
        message: "Login Successful",
        token: user.token[0].token,
      });
    } else {
      res.json({
        status: false,
        message: "Invalid Login Credentials",
      });
    }
  } else {
    res.json({
      status: false,
      message: "Invalid Login Credentials",
    });
  }
}

module.exports = Login;
