const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
            minPoolSize: 5,
        });
    } catch (error) {
        console.log('Database connection error::',error?.message);
        process.exit(1);

    }
}

mongoose.connection.on('connected',()=>{
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error',(error)=>{
    console.log('MongoDB connection error::',error?.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

module.exports=connectDB;