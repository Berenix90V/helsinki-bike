import express from "express"
import {
    countJourneysForSearch,
    countTotalJourneys,
    getAllJourneys,
    getPaginatedJourneysForSearch,
    getNumberOfJourneysFromStation,
    getNumberOfJourneysToStation,
    getAvgDistanceJourneysFrom,
    getAvgDistanceJourneysTo,
    getTopNDestinations,
    getTopNDepartures
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

router.route("/search/").get(async(req,res)=>{
    const take:number = parseInt(req.query.take as string)
    const skip:number = parseInt(req.query.skip as string)
    const patternFromStation:string = req.query.patternFrom as string
    const patternToStation:string = req.query.patternTo as string
    await getPaginatedJourneysForSearch(skip, take, patternFromStation, patternToStation)
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

router.route("/count/search/").get(async(req, res)=>{
    const patternFromStation:string = req.query.patternFrom as string
    const patternToStation:string = req.query.patternTo as string
    await countJourneysForSearch(patternFromStation, patternToStation)
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

router.route("/count/from/:id").get(async(req, res) =>{
    const id:number = parseInt(req.params.id)
    let month:string|undefined|number = req.query.month as string
    if (month !== undefined)
        month = parseInt(month)
    await getNumberOfJourneysFromStation(id, month)
        .then((nJourneys:number)=>
            res.status(200).json({
                count: nJourneys
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

router.route("/count/to/:id").get(async(req, res) =>{
    const id:number = parseInt(req.params.id)
    let month:string|undefined|number = req.query.month as string
    if (month !== undefined)
        month = parseInt(month)
    await getNumberOfJourneysToStation(id, month)
        .then((nJourneys:number)=>
            res.status(200).json({
                count: nJourneys
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

router.route('/from/:id/distance/avg').get(async(req, res) =>{
    const id = parseInt(req.params.id)
    let month:string|undefined|number = req.query.month as string
    if (month !== undefined)
        month = parseInt(month)
    await getAvgDistanceJourneysFrom(id, month)
        .then((avgDistance:number)=>
            res.status(200).json({
                avg: avgDistance
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

router.route('/to/:id/distance/avg').get(async(req, res) =>{
    const id: number = parseInt(req.params.id)
    let month:string|undefined|number = req.query.month as string
    if (month !== undefined)
        month = parseInt(month)
    await getAvgDistanceJourneysTo(id, month)
        .then((avgDistance:number)=>
            res.status(200).json({
                avg: avgDistance
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

router.route('/from/:id/top/destinations/').get(async(req,res)=>{
    const id:number = parseInt(req.params.id)
    const limit:number = parseInt(req.query.limit as string)
    let month:string|undefined|number = req.query.month as string
    if (month !== undefined)
        month = parseInt(month)
    await getTopNDestinations(id, limit, month)
        .then((topNDestinations:{count:number, Return_station_ID:number, Name:string}[]) => {
            res.status(200).json({
                destinations: topNDestinations
            })
        })
        .catch((err)=>{
            if(err instanceof  RangeError || err instanceof TypeError)
                res.status(400).json({
                    err: err.message
                })
            else
                res.status(404).json({
                    err:err.message
                })
        })
})

router.route('/to/:id/top/departures/').get(async(req,res)=>{
    const id:number = parseInt(req.params.id)
    const limit:number = parseInt(req.query.limit as string)
    let month:string|undefined|number = req.query.month as string
    if (month !== undefined)
        month = parseInt(month)
    await getTopNDepartures(id, limit, month)
        .then((topNDepartures:{count:number, Departure_station_ID:number, Name:string}[]) => {
            res.status(200).json({
                departures: topNDepartures
            })
        })
        .catch((err)=>{
            if(err instanceof  RangeError || err instanceof TypeError)
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