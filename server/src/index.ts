import express from 'express';
import dotenv from 'dotenv'

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('app started');
})
app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
});