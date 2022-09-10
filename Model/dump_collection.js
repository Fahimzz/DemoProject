const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dump_collectionSchema = new Schema({
    entry: {
        type: Number,
        required: true,
    },
    exit: {
        type: Number,
        required: true,
        
    },
    dateTime: {
        year:{
            type:Number,
            require:true
        }, 
        month:{
            type:Number,
            require:true
        }, 
        day: {
            type:Number,
            require:true
        }, 
        hour:{
            type:Number,
            require:true
        }

    }
    
}, { timestamps: true });

const dump_collection = mongoose.model('dump_collection', dump_collectionSchema);
module.exports = dump_collection;
