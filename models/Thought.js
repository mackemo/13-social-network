const { Schema, model } = require('mongoose');
const reactionSchema = require("./Reaction");

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