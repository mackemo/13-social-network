const { User, Thought }  = require('../../models')


module.exports = {
  // retrieve all users
    async getUsers (req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },


  // retrieve a single user
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

  
  // create a new user
    async createUser (req, res) {
      try{
        const userData = await User.create(req.body);
        res.json(userData);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    
};