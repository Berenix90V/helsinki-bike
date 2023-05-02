import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import "reflect-metadata"
import {connect_to_db} from "./db/db_connection";
import {router as stationRouter} from "./routes/journeys";



const app = express()

connect_to_db()

//MIDDLEWARE
app.use(express.json())

// ROUTES
app.use("/api/v1/journeys", stationRouter)

app.listen(process.env.PORT, ()=>{
    console.log("Server listening on port "+process.env.PORT)
})
export default app