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
            .select('-__v')
            .populate({ path: "reactions", select: "-__v" });

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
        try {
            const thought = await Thought.create(req.body);

            // find user and add thought to user
            const user = await User.findOneAndUpdate( { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                {new: true},
                { runValidators: true }
            )

            if (!user) {
                return res.status(404).json({ message: "No user with this username!" });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },


  // update thought
    async updateThought (req, res) {
        try {
            // find thought by id and set req.body
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },
                {$set: req.body},
                {new: true},
                { runValidators: true }
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
        try {
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
  async addReaction (req, res) {
    try{
        // find thought by id and add reaction to thought
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            {new: true},
            { runValidators: true }
        );

        if (!thought) {
            return res.status(404).json({ message: "No thought with this id!" });
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
  },


  // delete reaction
    async deleteReaction (req, res) {
        try{
            // find thought by id and remove reaction by id from thought
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { new: true},
                {runValidators: true }
            );  

            if (!thought) {
                return res.status(404).json({ message: "No thought with this id!" });
            }   

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};
