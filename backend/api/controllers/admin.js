
const getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) res.send(err)
    else res.send(users)
  })
}

module.exports = {
  getAllUsers,

}