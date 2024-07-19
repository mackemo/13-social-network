const { Schema, model } = require('mongoose');

// Reaction Schema
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Type.ObjectId,
            default: () => new Types.ObjectId(),
        }
    },
    {
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        }
    },
    {
        username: {
            type: String,
            required: true
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
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

module.exports = reactionSchema;