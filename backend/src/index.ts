import express, { Express } from "express"

import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client";


dotenv.config();

const port = Number(process.env.PORT)|| 5000;
const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";

const app: Express = express();
app.use(express.json());

export const prismaClient = new PrismaClient({});

app.listen(port,()=>{
    console.log(`App is running at port : ${port} and in ${envMode} mode`);
});




