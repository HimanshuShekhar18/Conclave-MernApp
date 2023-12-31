const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  try {
    const { accessToken } = req.cookies;
    console.log(accessToken);
    if (!accessToken) {
      throw new Error(); // throw error and get catch in catch block below
    }
    const userData = await tokenService.verifyAccessToken(accessToken);
    console.log(userData);
    // userData consists of _id(userId), activated, iat, exp
    /* _id(userId) jo ye return kar raha hain wo database(tokens collection) mein userId ke naam se store hain 
        jo ki database ka (users collection) ke _id ke equal hain
      */
    if (!userData) {
      throw new Error();
    }
    req.user = userData;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
