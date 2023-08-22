require("dotenv").config({
  path: "./secret.env",
});

const { SECRET_KEY } = process.env;

async function genLink(req, res, database, jwt, sendMails) {
  let { email } = req.body;
  let user = await database.findOne({ email });
  if (user !== null) {
    let payload = {
      email: user.email,
      token: user.token,
    };

    let tempSecret = user.password.slice(user.password.length - 5) + SECRET_KEY;
    let tempToken = await jwt.sign(payload, tempSecret, {
      expiresIn: "10m",
    });

    let tempLink = `https://chatwave.vercel.app/update/${user.uid}/${tempToken}`;

    sendMails(
      email,
      `<h1 align='center'>Reset Your Password</h1><br><p>Click The Link Below To Reset The Password 👇</p><br><a href='${tempLink}'>${tempLink}</a>`
    );

    res.json({
      status: true,
      message: "Mail Sent Successfully",
    });
  } else {
    res.json({
      status: false,
      message: "Invalid Email",
    });
  }
}

async function changePass(req, res, database, jwt) {
  let { uid, token } = req.params;

  try {
    let user = await database.findOne({ uid });
    let tempSecret = user.password.slice(user.password.length - 5) + SECRET_KEY;
    let tokenVerify = await jwt.verify(token, tempSecret);
    res.json({
      status: true,
      message: "Token Is Valid",
      email: tokenVerify.email,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Token Expired",
    });
  }
}

async function updatePass(req, res, database, bcrypt) {
  let { email } = req.params;
  let { newPass } = req.body;

  let user = await database.findOne({ email });
  if (user !== null) {
    let hashedPassword = await bcrypt.hash(newPass, 10);
    await user.updateOne({ $set: { password: hashedPassword } });
    res.json({
      status: true,
      message: "Password Changed",
    });
  }
}

module.exports = { genLink, changePass, updatePass };
