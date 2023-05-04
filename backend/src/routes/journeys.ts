import express from "express"
import {getAllJourneys, getNumberOfJourneysFromStation, getNumberOfJourneysToStation} from "../controllers/journeys";
import {Journey} from "../models/Journey";
const router = express.Router()

router.route("/").get(async (req, res) =>{
    const take:number = parseInt(req.query.take as string)
    await getAllJourneys(take)
        .then((allJourneys: Journey[]) =>
            res.status(200).json({
                journeys: allJourneys
            })
        )
        .catch((err) => {
            if (err instanceof RangeError || err instanceof TypeError)
                res.status(400).json({
                    err: err.message
                })
            else
                res.status(404).json({
                    err: err.message
                })
        })
})
router.route("/from/:id").get(async(req, res) =>{
    const id:number = parseInt(req.params.id)
    await getNumberOfJourneysFromStation(id)
        .then((nJourneys:number)=>
            res.status(200).json({
                njourneys: nJourneys
            })
        )
        .catch((err) => {
            if(err instanceof RangeError || err instanceof TypeError)
                res.status(400).json({
                    err: err.message
                })
            else
                res.status(404).json({
                    err:err.message
                })
        })
})

router.route("/to/:id").get(async(req, res) =>{
    const id:number = parseInt(req.params.id)
    await getNumberOfJourneysToStation(id)
        .then((nJourneys:number)=>
            res.status(200).json({
                njourneys: nJourneys
            })
        )
        .catch((err) => {
            if(err instanceof RangeError || err instanceof TypeError)
                res.status(400).json({
                    err: err.message
                })
            else
                res.status(404).json({
                    err:err.message
                })
        })
})
export {router}