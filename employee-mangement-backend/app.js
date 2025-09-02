const express = require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const authRoutes=require('./auth/route');
const userRoutes=require('./user/route');
const { swaggerUi, swaggerDocs } = require('./swagger');
const connectDB=require('./database');
const helmet = require("helmet");
const compression = require("compression");

dotenv.config();

connectDB();

const app=express();
app.use(helmet());
app.use(compression());

const corsOptions={
    origin:['http://localhost:3000'],
    optionsSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const PORT=process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send("Hello from the Backend");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});