const { Schema, model } = require('mongoose');

// User Schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trimmed: true
        }
    },
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
        }
    },
    // array for thoughts and friends
    {
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ]
    },
    {
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);


// virtual for counting friends
userSchema.virtual('friendCount').get(
    function() {
        return this.friends.length;
    }
);


const User = model('user', userSchema);

module.exports = User;