const { Schema, model } = require('mongoose')

const BranchSchema = new Schema({
    institutionName: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    branchIncharge: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contactNumber: {
        type: String,
        required: true
    },
    pincodeCovered: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = model('Branch', BranchSchema)