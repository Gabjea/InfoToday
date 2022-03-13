const User = require("../../models/user");
const Apply = require("../../models/apply");
const Problem = require('../../models/problem')
const mongoose = require("../../database");
const functions = require('../functions/index')
const jwtDecoder = require("jwt-decode");
const applyToTeacher = async (req, res) => {

    const student_id =  jwtDecoder(req.headers.authorization).id
    
    User.findOne({ _id: req.params.id }, async (err, finded) => {
        if (err) res.send(err)
        
       
        const alreadyExistsApply = await Apply.findOne({ teacher: finded._id, student: student_id, status: "pending", status: "accepted" })
            .exec()
            .catch((err) => {
                console.log("Error: ", err);
            });

        if (alreadyExistsApply) {
            return res.send("Ai aplicat deja la acest profesor.")
        }

        const newApply = new Apply({
            _id: new mongoose.Types.ObjectId(),
            student: student_id,
            teacher: req.params.id,
            status: "pending"
        });
        const savedApply = await newApply.save().catch((err) => {
            console.log("Error: ", err);
            res.status(500).json({ error: "Nu ai putut sa aplici!" });
        });

        if (savedApply) {

            res.status(200).send("Ai aplicat cu succes!")
        }



    })
}

const getAllTeachers = (req, res) => {
    User.find({ role: 'teacher' }, (err, users) => {
        if (err) return res.send(err)
        let teachers = []
        users.forEach(x => {
            teachers.push({ id: x._id, name: x.name + " " + x.surname, desc: x.desc, pic: x.profile_pic })
        })
        res.send(teachers)
    })
}

const getAllApplies = (req, res) => {
    const teacher_id =  jwtDecoder(req.headers.authorization).id
    
    Apply.find({ teacher: teacher_id, status: "pending" },async (err, applies) => {
        if (err) return res.send(err)
        let applies_info = []
        
        for(const apply of applies){
            await User.findOne({ _id: apply.student }).then(student => {
                applies_info.push({ id: student._id, name: student.name + " " + student.surname, pic: student.profile_pic })
            }).catch(err => {
                console.log(err)
            })

        }
        
        res.send(applies_info)
    })
}

const acceptApply = async(req, res) => {
    const teacher_id =  jwtDecoder(req.headers.authorization).id

    
    await Apply.findOneAndUpdate({
        student: req.params.id, teacher: teacher_id, status: "pending"},
        {status:"accepted"},{ new: true },async (err, result) => {
        if (err) return res.send(err)


        const teacher = await User.findById(teacher_id)

        const students = teacher.students
        students.push(req.params.id)
    }).clone()

        await User.findByIdAndUpdate(teacher_id, {students: students}, (err, result) =>{
            if (err) return res.send(err)
            res.send('')

      
    }).clone()
}

const getAllStudents = (req, res) => {
    const teacher_id =  jwtDecoder(req.headers.authorization).id

    User.findById(teacher_id ,async (err, teacher) => {
        if (err) return res.send(err)

        const students = teacher.students

        let students_info = []
        
        for(const student of students){
            await User.findOne({ _id: student }).then(result => {
                students_info.push({ id: result._id, name: result.name + " " + result.surname, pic: result.profile_pic })
            }).catch(err => {
                console.log(err)
            })

        }
        res.send(students_info)
     })
}

const declineApply = async(req, res) => {
    const teacher_id =  jwtDecoder(req.headers.authorization).id

    await Apply.findOneAndUpdate({
        student: req.params.id, teacher: teacher_id, status: "pending"},
        {status:"declined"},{ new: true },async (err, result) => {
        if (err) return res.send(err)
            res.send('')
        }).clone()

}

const deleteStudent = async(req, res) => {
    const teacher_id =  jwtDecoder(req.headers.authorization).id

    const teacher = await User.findById(teacher_id)

    const students = teacher.students
    const delStudIndex =students.findIndex((student) => student === req.params.id)
    students.splice(delStudIndex,1)
    
    await User.findByIdAndUpdate(teacher_id, {students: students}, async(err, result) =>{
        if (err) return res.send(err)
        
        await Apply.findOneAndRemove({student:req.params.id, teacher: teacher_id, status: "accepted"}, (err, result) => {
            if (err) return res.send(err)
            res.send('')
        }).clone



    }).clone()
}

const addProblem = async (req,res) => {
    const creator_id =  jwtDecoder(req.headers.authorization).id
    const {name, category, text, tests} = req.body
    
    const newProblem = new Problem({
        _id: new mongoose.Types.ObjectId(),
        name,
        category,
        text,
        creator: creator_id,
        tests
    });
    const savedProblem = await newProblem.save().catch((err) => {
        console.log("Error: ", err);
        res.status(500).json({ error: "Nu ai putut posta problema!" });
    });

    if (savedProblem) {

        res.status(200).send("Ai postat problema cu succes!")
    }

}


module.exports = {
    applyToTeacher,
    getAllTeachers,
    getAllApplies,
    acceptApply,
    getAllStudents,
    declineApply,
    deleteStudent,
    addProblem
}