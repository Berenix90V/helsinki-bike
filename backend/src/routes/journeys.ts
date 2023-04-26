import express from "express"
import {getAllJourneys} from "../controllers/journeys";
import {Journey} from "../models/Journey";
const router = express.Router()

router.route("/").get((req, res) =>{
    console.log("journeys")
    res.status(200).send({data: "success"})
    // getAllJourneys()
    //     .then((allJourneys: Journey[]) =>
    //         res.status(200).json({
    //             test: allJourneys
    //         }))
    //     .catch((err) => res.status(err.status).json({
    //         err: err.message
    //     }))
})

export {router}