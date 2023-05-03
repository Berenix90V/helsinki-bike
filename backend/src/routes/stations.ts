import express from "express";
import {getAllStations} from "../controllers/stations";
import {Station} from "../models/Station";
const router = express.Router()

router.route("/").get(async(req, res) => {
    await getAllStations()
        .then((allStations: Station[]) =>
        res.status(200).json({
            stations: allStations
        }))
        .catch((err: any)=>{
            res.status(400).json({
                err: err.message
            })
        })
})

export {router}