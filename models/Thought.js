const { Schema, model } = require('mongoose');
const reactionSchema = require("./Reaction");

// Thought Schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        }
    },
    {
        createdAt: {
            type: Date,
            default: Date.now,
            // formatting date to local time
            get: function(timestamp) {
                return new Date(timestamp).toLocaleString();
            }
        }
    },
    {
        username: {
            type: String,
            required: true
        }
    },
    {
        reactions: [
            // using reaction schema for reactions
            reactionSchema
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);


// virtual for counting reactions
thoughtSchema.virtual('reactionCount').get(
    function() {
        return this.reactions.length;
    }
);


const Thought = model('thought', thoughtSchema);

module.exports = Thought;