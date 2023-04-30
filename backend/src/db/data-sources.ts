import {DataSource} from "typeorm";
import * as dotenv from 'dotenv'
import {Journey} from "../models/Journey";
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: +process.env.PG_PORT!,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    entities: [Journey]
})