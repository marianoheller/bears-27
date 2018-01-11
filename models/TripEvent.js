let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let UserSchema = require('./User.js');
let User = UserSchema.model;
const YELP_API_KEY = process.env.YELP_API_KEY
const yelp = require('yelp-fusion');
const client = yelp.client(YELP_API_KEY);


let TripEventSchema = new Schema({

    locationName: String,
    rating: Number,
    address: String,
    possiblyAttending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    confirmedAttending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    EventDate: Date,
    PriceTier: Number,

});
TripEventSchema.statics.createNewEvent = (eventSource, placeName , date, callback) => {
    if(String(eventSource).toLowerCase() == 'yelp'){
        //Request the event with the given ID from yelp. 
        client.business(placeName)
            .then((result) => {
                let newEvent = {
                    locationName: result.jsonBody.name,
                    rating: result.jsonBody.rating, 
                    address: result.jsonBody.location.display_address[0] + 
                        result.jsonBody.location.display_address[1],
                    possiblyAttending: [], 
                    confirmedAttending: [], 
                    EventDate: new Date(date), 
                    PriceTier: result.jsonBody.price.length
                }
                TripEvent.create(newEvent).then((doc) =>
                    { console.log(doc._id) }
                ).catch((error) => {
                    console.log(error);
                })
                // console.log(result)
                callback(null, result)
            })
            .catch((error) => {
                console.log(error)
                callback, (error, null)
            })
    }
}
TripEventSchema.statics.addConfirmedAttending = function(googleID, eventID, callback){
    this.findOne({"_id": eventID})
    .exec()
    .then((found_event) => {
            if(!found_event){
                callback(new Error("Could not find an event with ID " + eventID));
            }
        else{
        mongoose.model('User').findOne({
            "googleID": googleID })
            .exec()
            .then((user) => {
                if(user === 'undefined'){
                    callback(new Error("Unable to find that user"), null);
                }
                else{
                    console.log(user._id);
                        this.find({
                            "_id": eventID, 
                            confirmedAttending: {
                                $elemMatch: {
                                    $eq: user._id
                                }
                            }
                        }, function(err, res){
                            if (err)
                                console.log(err);
                                callback(null, null);
                            if(!res || res.length === 0){
                                console.log("User is not yet attending this event");
                                found_event.confirmedAttending.push(user._id);
                                found_event.save();
                                mongoose.model('User').addPlannedEvent(googleID, eventID, function(err, result) {} );                                
                                callback(null, true)
                        }
                        else{
                            console.log(res);
                            console.log("User is already attending");
                            callback(null, true)
                        }
                        })

                    

            }
            })
            .catch((error) => {
                console.log(error);
                callback(new Error("Unable to find that user"), null);                
            })
        
        }})
        .catch((error) => {
            console.log("Err: " + error);
            callback(new Error("Could not find an event with ID " + eventID));
    } )
    
}
TripEventSchema.statics.addPossiblyAttending = function(googleID, eventID, callback){
    this.findOne({"_id": eventID})
    .exec()
    .then((found_event) => {
        if(!found_event){
            callback(new Error("Could not find an event with ID " + eventID));
        }
        else{
        mongoose.model('User').findOne({
            "googleID": googleID })
            .exec()
            .then((user) => {
                if(user === 'undefined'){
                    callback(new Error("Unable to find that user"), null);
                }
                else{
                    this.find({
                        "_id": eventID, 
                        confirmedAttending: {
                            $elemMatch: {
                                $eq: user._id
                            }
                        }
                    }, function(err, res){
                        if (err)
                            console.log(err);
                            callback(null, null);
                        if(!res || res.length === 0){
                            console.log("User is not yet attending this event");
                            found_event.possiblyAttending.push(user._id);
                            found_event.save();
                            mongoose.model('User').addPlannedEvent(googleID, eventID, function(err, result) {} );                                
                            callback(null, true)
                    }
                    else{
                        console.log(res);
                        console.log("User is already attending");
                        callback(null, true)
                    }
                    })

                    

            }
            })
            .catch((error) => {
                console.log(error);
                callback(new Error("Unable to find that user"), null);                
            })
        
        }})
        .catch((error) => {
            console.log("Err: " + error);
            callback(new Error("Could not find an event with ID " + eventID));
    } )
    
}
var TripEvent = mongoose.model('TripEvent', TripEventSchema);

module.exports = TripEvent;