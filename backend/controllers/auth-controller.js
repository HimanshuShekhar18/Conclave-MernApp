const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone field is required!" });
    }

    // otp
    const otp = await otpService.generateOtp();
    // res.send(otp);   // don't send the OTP as plain text
    // res.json({ otp: otp }); // Send the OTP as JSON response

    // hash
    const ttl = 1000 * 60 * 2; // 2 min time validity
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`; // phone+otp+expiry ko milakar ek data banao or iska hash create karo
    const hash = hashService.hashOtp(data);
    // res.json({ hash: hash }); // Send the hash as JSON response

    // send OTP
    try {
      // await otpService.sendBySms(phone, otp);
      res.json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "message sending failed" });
    }
  }

  // verify otp method
  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const [hashedOtp, expires] = hash.split(".");

    // Date.now() ia a number, but expires is a string so add '+' infront to convert explicitly to number
    if (Date.now() > +expires) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user;
    try {
      user = await userService.findUser({ phone }); // filter will be an object
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Db error" });
    }

    // Token
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    await tokenService.storeRefreshToken(refreshToken, user._id);

    // refreshToken ko cookie se attach karo, har ek request pe cookie automatically attach ho jati hai request ko; isse hame manually har baar har request pe refreshToken send karne ki jarurat nahi hongi
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days tak cookie valid rahi rahengi
      httpOnly: true, // client pe jo javascript hain wo cookie ko read nahi kar payega, only server read kar payenga
    });

    /*
       accessToken ko hamare local storage mein store karne ka plan tha,
       but wo utna secure nahi hain;
       so we will attach cookies to accessToken
    */
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days tak cookie valid rahi rahengi
      httpOnly: true, // client pe jo javascript hain wo cookie ko read nahi kar payega, only server read kar payenga
    });

    const userDto = new UserDto(user);
    // res.json({ accessToken, user: userDto });
    res.json({user: userDto, auth: true });

  }
}

module.exports = new AuthController();
