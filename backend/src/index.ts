import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import "reflect-metadata"
import {connect_to_db} from "./db/db_connection";

const app = express()

connect_to_db()

app.listen(process.env.PORT, ()=>{
    console.log("Server listening on port "+process.env.PORT)
})