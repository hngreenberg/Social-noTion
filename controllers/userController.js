const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


const headCount = async () =>
  User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);


const grade = async (userId) =>
  User.aggregate([
    
    { $match: { _id: ObjectId(userId) } },
    {
      $unwind: '$friends',
    },
    {
      $group: {
        _id: ObjectId(userId),
        overallGrade: { $avg: '$friends.score' },
      },
    },
  ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
        };
        return res.json(userObj);
      })
        console.log(err);
        return res.status(500).json(err);
      }
  },
  
  getSingleUser(req, res) 
    user.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
              grade: await grade(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  ;
  // create a new user
  createuser(req, res) 
    user.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  ;
  // Delete a user and remove them from the course
  deleteuser(req, res) 
    user.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Course.findOneAndUpdate(
              { users: req.params.userId },
              { $pull: { users: req.params.userId } },
              { new: true }
            )
      )
      .then((course) =>
        !course
          ? res.status(404).json({
              message: 'user deleted, but no courses found',
            })
          : res.json({ message: 'user successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  ;

  // Add an assignment to a user
  addAssignment(req, res) 
    console.log('You are adding an assignment');
    console.log(req.body);
    user.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { assignments: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  ;
  // Remove assignment from a user
  removeAssignment(req, res) 
    user.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  ;
