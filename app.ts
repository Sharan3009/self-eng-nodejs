import express from 'express';
import config from './config/app-config';

const app:express.Application = express();
const port = config.port;
app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world")
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})