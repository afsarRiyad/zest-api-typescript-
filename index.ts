import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './modules/task/routes/taskRoutes'
import errorMiddleware from './middleware/errorMiddleware';

dotenv.config()
const app = express();
app.use(express.json());


app.use('/api', taskRoutes);


app.use(errorMiddleware);

const port = 5000

const startServer = async () => {
    try {
        const mongoUri  = process.env.MONGO_URI as string
         if(!mongoUri){
            console.log('mongoURI is not defined in .env');
         }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully!');
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    } catch (error : unknown) {
         if (error instanceof Error) {
                console.error('MongoDB connection failed:', error.message);
            } else {
                console.error('MongoDB connection failed:', error);
            }
        process.exit(1);
    }
}

startServer();
