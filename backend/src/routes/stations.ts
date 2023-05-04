import express from "express";
import {getAllStations, getStationByID} from "../controllers/stations";
import {Station} from "../models/Station";
const router = express.Router()

router.route("/").get(async(req, res) => {
    await getAllStations()
        .then((allStations: Station[]) =>
            res.status(200).json({
                stations: allStations
        }))
        .catch((err: any)=>{
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