import express from "express"
import {getAllJourneys} from "../controllers/journeys";
import {Journey} from "../models/Journey";
const router = express.Router()

router.route("/").get((req, res) =>{
    getAllJourneys()
        .then((allJourneys: Journey[]) =>
            res.status(200).json({
                journeys: allJourneys
            }))
        .catch((err) => res.status(err.status).json({
            err: err.message
        }))
})

export {router}