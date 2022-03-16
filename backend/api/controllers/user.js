const User = require("../../models/user");
const Apply = require('../../models/apply')
const Message = require('../../models/message')
const Problem = require('../../models/problem')
const mongoose = require("../../database");
const bcrypt = require("bcrypt");
const fs = require('fs')


const functions = require("../functions");
const jwtDecoder = require("jwt-decode");

const Session = require("../../models/session");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

    const jwtToken = functions.createAuthToken(userWithEmail._id, userWithEmail.name + " " + userWithEmail.surname, userWithEmail.role)
    res.json({
      message: "Te-ai autentificat cu succes!",
      token: "Bearer " + jwtToken,
    });

  });
};

const registerController = async (req, res) => {
  const { name, surname, email, password, isTeacher } = req.body;
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
      role: isTeacher ? 'teacher' : 'student',
      subscription: false
    });
    const savedUser = await newUser.save().catch((err) => {
      console.log("Error: ", err);
      res.status(500).json({ error: "Inregistrarea a esuat!" });
    });

    if (savedUser) {
      const jwtToken = functions.createAuthToken(savedUser._id, savedUser.name + " " + savedUser.surname, savedUser.role)
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

const getUserRole = async (req, res) => {
  const user = await functions.getUserByIdFromToken(req.headers.authorization)
  res.send(user.role)
}


const getAllUserApplies = (req, res) => {
  const student_id = jwtDecoder(req.headers.authorization).id

  Apply.find({ student: student_id }, async (err, result) => {
    let applies_info = []
    for (const apply of result) {
      await User.findOne({ _id: apply.teacher }).then(teacher => {
        applies_info.push({ id: teacher._id, name: teacher.name + " " + teacher.surname, pic: teacher.profile_pic, status: apply.status })
      }).catch(err => {
        console.log(err)
      })
    }


    res.send(applies_info)
  })

}



const uploadProfilePictureController = async (req, res) => {

  try {
    const token = req.headers.authorization.split(' ')[1]
    const user = await functions.getUserByIdFromToken(token)
    const path = '/uploads/icons/' + user._id + ".png"
    const file = await functions.uploadFile(req.files, path, 'png')

    if (!file)
      res.send({
        status: false,
        message: 'Nicio poza nu a fost incarcata!'
      });
    else {
      await functions.updateUserProfile(token, { profile_pic: process.env.HOST + path })
      console.log('caca');
      res.status(200).json({ message: "Ti-ai actualizat poza de profil cu succes!" })
    }

  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
}


const getUploadedIcon = (req, res) => {

  res.sendFile(req.params.img, { root: './uploads/icons' })
}

const getUserProfileFromIdController = async (req, res) => {
  const id = req.params.id
  res.send(await User.findById(id).catch(
    (err) => {
      console.log("Error: ", err);
    }
  ))
}

const getUserChats = async (req, res) => {
  const user_id = jwtDecoder(req.headers.authorization).id


  await Message.find({ receiver: user_id }).distinct('sender', async (err, result) => {

    let sender_info = []
    for (const id of result) {
      await User.findOne({ _id: id }).then(sender => {
        sender_info.push({ id: sender._id, name: sender.name + " " + sender.surname, pic: sender.profile_pic })
      }).catch(err => {
        console.log(err)
      })
    }


    res.send(sender_info)



  }).clone()

}

const getUserMessagesFromPerson = async (req, res) => {
  const user_id = jwtDecoder(req.headers.authorization).id
  const chattingWith = req.params.id

  await Message.find({ $or: [{ sender: user_id, receiver: chattingWith }, { sender: chattingWith, receiver: user_id }] }, (err, result) => {
    if (err) res.send(err)


    res.send(result)
  }).clone()

}

const getAllProblems = async (req, res) => {

  const problems = await Problem.find({}, (err, result) => {
    if (err) return res.send(err)

  }).clone()

  console.log(problems)

  res.send(problems)

}

const getAllUserSessions = async (req, res) => {
  const user_id = jwtDecoder(req.headers.authorization).id
  const user_role = jwtDecoder(req.headers.authorization).role

  let sessions_info = []
  const sessions = await Session.find({ $or: [{ student: user_id }, { teacher: user_id }] })

  for (const session of sessions) {
    let result = {}
    if (user_role === 'student') {
      result = await User.findById(session.teacher)

    }
    else {
      result = await User.findById(session.student)
    }
    sessions_info.push({ session, pic: result.pic, name: result.name + ' ' + result.surname })
  }


  console.log(sessions_info)
  res.send(sessions_info)

}


const compileProblem = async (req, res) => {
  const startTime= new Date()
  const user_id = jwtDecoder(req.headers.authorization).id
  const numeProblema = req.params.nume

  const { editorCode, input } = req.body
  const pathCode = './uploads/compile/' + numeProblema + '/' + user_id + ".cpp"

  const pathInput = './uploads/compile/' + numeProblema + '/' + user_id + '.txt'

  fs.writeFileSync(pathCode, editorCode);
  const problema = await Problem.findOne({ name: numeProblema })
  const tests = []
  for (const index in problema.tests) {

    const { stdout, stderr } = await exec(`cd ./uploads/compile/${numeProblema} && c++ -O3 ${user_id}.cpp -o ${user_id}.exe && ${user_id}.exe < ./inputs/${index}.txt`)
    //console.log(stdout,problema.tests[index].input, problema.tests[index].output);
    tests.push(stdout.trim() === problema.tests[index].output.trim())

  }
 
  
  res.send(tests)




  // const problema = await Problem.findOne({name: numeProblema})
  // const tests = []

  // for(const test of problema.tests){
  //   const output = await functions.compileProblemTest(editorCode,test.input)

  //   tests.push(test.output.trim() === output.trim())
  // }
  // res.send(tests)
}


module.exports = {
  loginController,
  registerController,
  getUserProfileController,
  updateUserProfileController,
  getUserRole,
  getAllUserApplies,
  uploadProfilePictureController,
  getUploadedIcon,
  getUserProfileFromIdController,
  getUserChats,
  getUserMessagesFromPerson,
  getAllProblems,
  getAllUserSessions,
  compileProblem
};
