const { User, Thought }  = require('../models')


module.exports = {
  // retrieve all users
    async getUsers (req, res) {
        try {
            const users = await User.find()
    
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },


  // retrieve single user
    async getSingleUser (req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
          .select('-__v')
          // include thoughts and friends
          .populate({ path: "thoughts", select: "-__v" })
          .populate({ path: "friends", select: "-__v" });

        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },

  
  // create new user
    async createUser (req, res) {
      try{
        const userData = await User.create(req.body);
        res.json(userData);
      } catch (err) {
        res.status(500).json(err);
      }
    },


  // update user
    async updateUser (req, res) {
      try{
        // find user by id, update req.body
        const user = await User.findOneAndUpdate({ _id: req.params.userId },
          {$set: { username: req.body.username, email: req.body.email}},
          {new: true},
        )

        if (!user) {
          return res.status(404).json({ message: "No user with this id!" });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },


  // delete user
    async deleteUser (req, res) {
      try{
        // delete user by id
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
          return res.status(404).json({ message: "No user with this id!" });
        }

        // delete all thoughts associated by this specific user id
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.status(200).json({ message: `${user.username} has been deleted`})
      } catch (err) {
        res.status(500).json(err);
      }
    },


  // add friend
  async addFriend (req, res) {
    try{
      // update user by id, add friend id
      const user = await User.findOneAndUpdate({ _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        {new: true},
        { runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },


  // delete friend
    async deleteFriend (req, res) {
      try{
        // update user by id, delete friend id
        const user = await User.findOneAndUpdate({ _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          {new: true},
          { runValidators: true }
        );

        if (!user) {
          return res.status(404).json({ message: "No user with this id!" });
        }

        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    }
};
