import express from "express"
import {getAllJourneys} from "../controllers/journeys";
import {Journey} from "../models/Journey";
const router = express.Router()

router.route("/").get(async (req, res) =>{
    await getAllJourneys()
        .then((allJourneys: Journey[]) =>
            res.status(200).json({
                test: allJourneys
            }))
        .catch((err) => res.status(404).json({
            err: err.message
        }))
})

export {router}