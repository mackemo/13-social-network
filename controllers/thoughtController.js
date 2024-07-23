const { User, Thought }  = require('../models')


module.exports = {
  // retrieve all thoughts
    async getThoughts (req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },


  // retrieve single thought
    async getSingleThought (req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v');

        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },

  
  // create new thought
    async createThought (req, res) {
      try{
        const thought = await Thought.create(req.body);

        // find user and add thought to user
        const user = await User.findOneAndUpdate( { _id: req.params.userId },
            { $addToSet: { thoughts: thought._id } },
            {new: true}
        )

        if (!user) {
            return res.status(404).json({ message: "No user with this id!" });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },


  // update thought
    async updateThought (req, res) {
      try{
        // find thought by id and set req.body
        const thought = await Thought.findOneandUpdate({ _id: req.params.thuoghtId },
          {$set: req.body},
          {new: true}
        )

        if (!thought) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    },


  // delete thought
    async deleteThought (req, res) {
      try{
        // delete thought by id
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        res.status(200).json({ message: `Thought has been deleted`})
      } catch (err) {
        res.status(500).json(err);
      }
    },


  // add reaction
  async addFriend (req, res) {
    try{
      const user = await User.findOneandUpdate({ _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        {new: true}
      );

      if (!user) {
        return res.status(404).json({ message: "No user with this id!" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },


  // delete reaction
    async deleteFriend (req, res) {
      try{
        const user = await User.findOneAndUpdate({ _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          {new: true}
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
