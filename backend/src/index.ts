import express from 'express'
import "reflect-metadata"

const app = express()

app.listen(3000, ()=>{
    console.log("Server listening on port 3000")
})