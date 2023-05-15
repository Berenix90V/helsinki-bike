import express from "express";
import {
    countSearchedStations, countStations,
    getPaginatedSearchedStations,
    getPaginatedStations,
    getStationByID
} from "../controllers/stations";
import {Station} from "../models/Station";
const router = express.Router()

router.route("/").get(async(req, res) => {
    const take:number = parseInt(req.query.take as string)
    const skip:number = parseInt(req.query.skip as string)
    await getPaginatedStations(skip, take)
        .then((allStations: Station[]) =>
            res.status(200).json({
                stations: allStations
        }))
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

router.route("/count/").get(async(req, res)=>{
    await countStations()
        .then((countStations: number) =>
            res.status(200).json({
                count: countStations
            })
        )
        .catch((err) =>
            res.status(404).json({
                err: err.message
            })
        )
})
router.route("/count/search/").get(async(req, res)=>{
    const patternName:string = req.query.patternName as string
    await countSearchedStations(patternName)
        .then((countStations: number) =>
            res.status(200).json({
                count: countStations
            })
        )
        .catch((err) => {
            res.status(404).json({
                err: err.message
            })
        })
})

router.route("/search/").get(async(req, res)=>{
    const patternName:string = req.query.patternName as string
    const take:number = parseInt(req.query.take as string)
    const skip:number = parseInt(req.query.skip as string)
    await getPaginatedSearchedStations(skip, take, patternName)
        .then((stations: Station[]) =>
            res.status(200).json({
                stations: stations
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

router.route("/:id").get(async(req, res) => {
    const id= parseInt(req.params.id)
    await getStationByID(id)
        .then((station:Station) =>
            res.status(200).json({
                station: station
        }))
        .catch((err) => {
            if(err instanceof RangeError){
                if(err.message!="Not found")
                    res.status(400).json({
                        err:err.message
                    })
                else
                    res.status(404).json({
                        err:err.message
                    })
            }
            if(err instanceof TypeError){
                res.status(400).json({
                    err: err.message
                })
            }
        })
})



export {router}