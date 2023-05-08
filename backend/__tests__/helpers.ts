import {AppDataSource} from "../src/db/data-sources";

export async function count_stations_instances(){
    const data = await AppDataSource.query(`SELECT count(*) FROM stations`)
    return +data[0].count
}

export async function get_nth_journey_id(skip:number){
    const res = await AppDataSource.query(`SELECT "ID" FROM trips ORDER BY "ID" LIMIT 1 OFFSET $1`, [skip])
    return +res[0].ID
}

export async function totJourneys(){
    const res = await AppDataSource.query(`SELECT count(*) FROM trips`)
    return +res[0].count
}
