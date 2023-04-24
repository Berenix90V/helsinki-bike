import express from 'express'
import "reflect-metadata"
import {connect_to_db} from "./db/db_connection";

const app = express()

connect_to_db()

app.listen(3000, ()=>{
    console.log("Server listening on port 3000")
})