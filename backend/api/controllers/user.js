const User = require("../../models/user");

const mongoose = require("../../database");
const bcrypt = require("bcrypt");

const functions = require("../functions");
const jwtDecoder = require("jwt-decode");
const fs = require('fs');
const exec = require('child_process').exec;

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await User.findOne({ email: email }).catch((err) => {
    console.log("Error: ", err);
  });

  if (!userWithEmail)
    return res
      .status(400)
      .json({ message: "Email-ul sau parola sunt incorecte!" });

  bcrypt.compare(password, userWithEmail.password, function (err, result) {
    if (err || !result)
      return res
        .status(406)
        .json({ error: "Email-ul sau parola sunt incorecte!" });

    const jwtToken = functions.createAuthToken(userWithEmail._id, userWithEmail.name + " " + userWithEmail.surname)
    res.json({
      message: "Te-ai autentificat cu succes!",
      token: "Bearer " + jwtToken,
    });

  });
};

const registerController = async (req, res) => {
  const { name, surname, email, password } = req.body;
  const alreadyExistsUser = await User.findOne({ email: email })
    .exec()
    .catch((err) => {
      console.log("Error: ", err);
    });

  if (alreadyExistsUser) {
    return res.status(406).json({ message: "Acest email este deja folosit!" });
  }
  const passwordSalt = 10;
  bcrypt.hash(password, passwordSalt, async function (err, hashedPassword) {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      surname,
      profile_pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      email,
      password: hashedPassword,
      role: "user",
      subscription: false
    });
    const savedUser = await newUser.save().catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({ error: "Inregistrarea a esuat!" });
    });

    if (savedUser) {
      const jwtToken = functions.createAuthToken(savedUser._id, savedUser.name + " " + savedUser.surname)
      res.json({
        message: "Te-ai inregistrat cu succes",
        token: "Bearer " + jwtToken,
      });
    }
  });
};



const getUserProfileController = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]
  res.send(await functions.getUserByIdFromToken(token));
};

const updateUserProfileController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    await functions.updateUserProfile(token, req.body)
    res.status(200).json({ message: "Ti-ai actualizat profilul cu succes!" });

  } catch {
    res
      .status(406)
      .json({ error: "Actualizare nereusita!" });
  }
}

const compileCode = (req, res) => {
  const { code } = req.body
    console.log(code);
    
    fs.writeFile('helloworld.cpp', code, async function (err) {
      if (err) return console.log(err);
      
      exec(`gcc helloworld.cpp -o opt`);
      
    })
}


module.exports = {
  loginController,
  registerController,
  getUserProfileController,
  updateUserProfileController,
  compileCode
};
