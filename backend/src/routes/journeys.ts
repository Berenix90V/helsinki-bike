import express from "express"
import {
    countJourneysWithDepartureStationStartingWith,
    countTotalJourneys,
    getAllJourneys, getJourneysWithDepartureStationStartingWith,
    getNumberOfJourneysFromStation,
    getNumberOfJourneysToStation
} from "../controllers/journeys";
import {Journey} from "../models/Journey";
const router = express.Router()

router.route("/").get(async (req, res) =>{
    const take:number = parseInt(req.query.take as string)
    const skip:number = parseInt(req.query.skip as string)
    await getAllJourneys(skip, take)
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

router.route("/count").get(async(req, res) => {
    await countTotalJourneys()
        .then((countJourneys: number) =>
        res.status(200).json({
            count: countJourneys
        }))
        .catch((err) => {
            res.status(404).json({
                err: err.message
            })
        })
})

router.route("/search/from/").get(async(req,res)=>{
    const take:number = parseInt(req.query.take as string)
    const skip:number = parseInt(req.query.skip as string)
    const pattern:string = req.query.pattern as string
    await getJourneysWithDepartureStationStartingWith(skip, take, pattern)
        .then((journeys: Journey[])=>
            res.status(200).json({
                journeys: journeys
            })
        )
        .catch((err)=>{
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

router.route("/count/search/from/").get(async(req, res)=>{
    const pattern:string = req.query.pattern as string
    await countJourneysWithDepartureStationStartingWith(pattern)
        .then((countJourneys: number)=>
            res.status(200).json({
                count: countJourneys
            })
        )
        .catch((err) =>
            res.status(404).json({
                err: err.message
            })
        )
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