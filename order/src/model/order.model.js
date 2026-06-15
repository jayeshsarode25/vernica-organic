import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    street : String,
    city : String,
    state : String,
    pincode : String,
    country : String,
    isDefault: { type: Boolean, default: false },
});


const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    items : [{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            required : true
        },
        quantity :{
            type : Number,
            required : true,
            min : 1
        },
        price:{
            amount:{
                type : Number,
                required : true
            },
            currency:{
                type : String,
                required : true,
                enum : ['INR', 'USD']
            }
        }
    }],
    status:{
        type : String,
        enum : ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED','CONFIRMED'],
        default: 'PENDING',
    },
    totalPrice :{
        amount:{
            type : Number,
            required : true
        },
        currency:{
            type : String,
            required : true,
            enum : ['INR', 'USD']
        }
    },
    paymentMethod: {
        type: String,
        enum: ['ONLINE', 'COD'],
        default: 'ONLINE',
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'COD_PENDING'],
        default: 'PENDING',
    },
    shippingAddress :{
        type : addressSchema,
        required : true
    },
},{ timestamps: true });


const orderModel = mongoose.model('order', orderSchema);

export default orderModel;
