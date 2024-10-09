const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    id:{
        type:Number
    },
    title:{
        type:String,
        // required:true
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fnature-hotel&psig=AOvVaw3kTwjUT8L7XtLocIwrL52r&ust=1727880628993000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICdp-i27YgDFQAAAAAdAAAAABAJ",
        // set:(v)=>{v ==="" ?"https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fnature-hotel&psig=AOvVaw3kTwjUT8L7XtLocIwrL52r&ust=1727880628993000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICdp-i27YgDFQAAAAAdAAAAABAJ":v}
    },
    price:{
        type:Number,
        // min:0
    },
    category:{
        type:String
    },
    sold:{
        type:Boolean
    },
    dateOfSale:{
        type:String
    }

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;