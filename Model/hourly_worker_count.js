const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hourly_worker_countSchema = new Schema({
    worker_count: {
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

const hourly_worker_count = mongoose.model('hourly_worker_count', hourly_worker_countSchema);
module.exports = hourly_worker_count;
