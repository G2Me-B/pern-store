import express from 'express';
import cors from 'cors';
import "dotenv/config";
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT
// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet()); // For security headers
app.use(morgan('dev')); // For logging requests

app.get('/', (req, res) => {
    console.log(res.getHeaders())
    res.send('Hello World!');
})  


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})