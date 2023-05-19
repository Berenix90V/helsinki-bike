import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import "reflect-metadata"
import {connect_to_db} from "./db/db_connection"
import {router as journeyRouter} from "./routes/journeys"
import {router as stationRouter} from "./routes/stations"
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

const cors = require("cors")

const app = express()

connect_to_db()

//MIDDLEWARE
app.use(express.json())
app.use(cors())

// ROUTES
app.use("/api/v1/journeys", journeyRouter)
app.use("/api/v1/stations", stationRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if(process.env.NODE_ENV !== 'test'){
    app.listen(process.env.PORT, ()=>{
        console.log("Server listening on port "+process.env.PORT)
    })
}

export default app