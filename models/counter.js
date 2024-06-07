const mongoose = require('mongoose');

const sequenceCounterSchema = new mongoose.Schema({
    sequenceName: { type: String, required: true, unique: true },
    sequenceValue: { type: Number, default: 0 }
});

const SequenceCounter = mongoose.model('SequenceCounter', sequenceCounterSchema);

module.exports = SequenceCounter;
