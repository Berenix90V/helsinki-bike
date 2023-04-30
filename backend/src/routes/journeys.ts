import express from "express"
import {getAllJourneys} from "../controllers/journeys";
import {Journey} from "../models/Journey";
const router = express.Router()

router.route("/").get(async (req, res) =>{
    const take:number = parseInt(req.query.take as string) || 10
    await getAllJourneys(take)
        .then((allJourneys: Journey[]) =>
            res.status(200).json({
                test: allJourneys
            }))
        .catch((err) => {
            if (err instanceof RangeError)
                res.status(400).json({
                    err: err.message
                })
            else
                res.status(404).json({
                    err: err.message
                })
        })
})

export {router}