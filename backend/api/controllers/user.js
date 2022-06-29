const User = require("../../models/user");
const Apply = require('../../models/apply')
const Message = require('../../models/message')
const Problem = require('../../models/problem')
const Submit = require('../../models/submit')
const Conversation = require('../../models/conversation')
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
            coins: 0
        });
        const savedUser = await newUser.save().catch((err) => {
            console.log("Error: ", err);
            res.status(500).json({ error: "Inregistrarea a esuat!" });
        });

        if (savedUser) {
            const jwtToken = functions.createAuthToken(savedUser._id, savedUser.name + " " + savedUser.surname, savedUser.role)
            const customer = await stripe.customers.create({
                id: savedUser.id,
                name: savedUser.name + ' ' + savedUser.surname
            });
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
    let convesations = []

    await Conversation.find({ $or: [{ user1: user_id }, { user2: user_id }] }, async (err, result) => {
        if (err) res.send(err)
        let chattingWith = {}
        for (const conf of result) {
            if (user_id !== conf.user1) {
                chattingWith = await User.findById(conf.user1)
            }
            else {
                chattingWith = await User.findById(conf.user2)
            }

            convesations.push({ room: conf._id, id: chattingWith._id, name: chattingWith.name + " " + chattingWith.surname, pic: chattingWith.profile_pic })

        }
        res.send(convesations)

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



    res.send(problems)

}

const getAllUserSessions = async (req, res) => {
    const user_id = jwtDecoder(req.headers.authorization).id
    const user_role = jwtDecoder(req.headers.authorization).role

    let sessions_info = []
    const sessions = await Session.find({ $or: [{ student: user_id, status: "ongoing" }, { teacher: user_id, status: "ongoing" }] })

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



    res.send(sessions_info)

}


const compileProblem = async (req, res) => {
    const startTime = new Date()
    const user_id = jwtDecoder(req.headers.authorization).id
    const numeProblema = req.params.nume

    const { editorCode, input } = req.body
    const pathCode = './uploads/compile/' + numeProblema + '/' + user_id + ".cpp"

    const pathInput = './uploads/compile/' + numeProblema + '/' + user_id + '.txt'

    fs.writeFileSync(pathCode, editorCode);
    const problema = await Problem.findOne({ name: numeProblema })
    const tests = []
    let compileErr = ''
    try {

        for (const index in problema.tests) {
         
           // const { stdout, stderr } = await exec(`cd ./uploads/compile/${numeProblema} && c++ -O3 ${user_id}.cpp -o ${user_id}.exe && ${user_id}.exe < ./inputs/${index}.txt`)
           const { stdout, stderr } = await exec(`cd ./uploads/compile/${numeProblema}  && echo ${problema.tests[index].input} > ${user_id}.txt && c++ -O3 ${user_id}.cpp -o ${user_id}.exe && ${user_id}.exe < ${user_id}.txt && del ${user_id}.txt`)

            tests.push(stdout?.trim() === problema.tests[index].output.trim() ? 100 / problema.tests.length : 0)



        }
        console.log(tests);
        const { stdout, stderr } = await exec(`cd ./uploads/compile/${numeProblema}  && del ${user_id}.cpp && del ${user_id}.exe`)

        const score = tests.reduce((x, y) => x + y)
        const newSubmit = new Submit({
            _id: new mongoose.Types.ObjectId(),
            problem: problema._id,
            user: user_id,
            score: score
        });
        const savedSubmit = await newSubmit.save().catch((err) => {
            console.log("Error: ", err);
            res.status(500).json({ error: "Evaluarea a esuat!" });
        });

        if (savedSubmit) {

            res.send({ ans: tests, err: '', score })
        }




    } catch (err) {
        console.log(err.stderr);
        const newSubmit = new Submit({
            _id: new mongoose.Types.ObjectId(),
            problem: problema._id,
            user: user_id,
            score: 0
        });
        const savedSubmit = await newSubmit.save().catch((err) => {
            console.log("Error: ", err);
            res.status(500).json({ error: "Evaluarea a esuat!" });
        });

        if (savedSubmit) {


            res.send({ ans: new Array(problema.tests.length).fill(false), err: err.stderr, score: 0 })
        }
    }


    // const problema = await Problem.findOne({name: numeProblema})
    // const tests = []

    // for(const test of problema.tests){
    //   const output = await functions.compileProblemTest(editorCode,test.input)

    //   tests.push(test.output.trim() === output.trim())
    // }
    // res.send(tests)
}


const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const buyCoins = async (req, res) => {
    let { amount, id } = req.body
    const user_id = jwtDecoder(req.headers.authorization).id
    try {
        const payment = await stripe.paymentIntents.create({
            amount: 100 * amount,
            currency: "ron",
            description: "Coins",
            payment_method: id,
            confirm: true
        })


        await User.findByIdAndUpdate(user_id, { $inc: { coins: amount } }).then(() => {
            res.json({
                message: "Payment successful",
                success: true
            })
        })


    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
}

const getMyProblems = async (req, res) => {
    const user_id = jwtDecoder(req.headers.authorization).id

    let submissions = [];

    Submit.find({ user: user_id }, async (err, result) => {
        //let applies_info = []


        for (const submission of result) {
            await Problem.findOne({ _id: submission.problem }).then(problem => {
                submissions.push({ name: problem.name, date: submission.date, score: submission.score })
            }).catch(err => {
                console.log(err)
            })
        }//*/
        res.send(submissions);
    })
}

const createConversation = async (req, res) => {
    const user_id = jwtDecoder(req.headers.authorization).id
    const teacher_id = req.params.id
    console.log(user_id, teacher_id);
    const alreadyExistsConversation = await Conversation.findOne({ $or: [{ user1: user_id, user2: teacher_id }, { user1: teacher_id, user2: user_id }] })


    if (alreadyExistsConversation)
        return res.send('Exista deja o conversatie.')


    const newConversation = new Conversation({
        _id: new mongoose.Types.ObjectId(),
        user1: user_id,
        user2: teacher_id
    });
    const savedConversation = await newConversation.save().catch((err) => {
        console.log("Error: ", err);
        res.status(500).json({ error: "Evaluarea a esuat!" });
    });

    if (savedConversation) {

        res.send("Conversatia a fost creata cu succes.")
    }
}

const acceptSession = async(req, res) => {
    const session_id = req.params.id

    const session = await Session.findById(session_id)

    let newTeacherBalance = await User.findByIdAndUpdate(session.teacher, { $inc: { coins: session.cost } }, {
        new: true
    })

    let newUserBalance = await User.findByIdAndUpdate(session.student, { $inc: { coins: -session.cost } }, {
        new: true
    })


    let newSessionAcceptedStatus = await Session.findByIdAndUpdate(session_id, { accepted: true }, {
        new: true
    })

    res.send('')
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
    compileProblem,
    buyCoins,
    getMyProblems,
    createConversation,
    acceptSession
};
