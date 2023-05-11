import {AppDataSource} from "../src/db/data-sources";

export async function count_stations_instances(){
    const data = await AppDataSource.query(`SELECT count(*) FROM stations`)
    return +data[0].count
}

export async function count_journeys_instances(){
    const data = await AppDataSource.query(`SELECT count(*) FROM trips`)
    return +data[0].count
}

export async function get_nth_journey_id(skip:number){
    const res = await AppDataSource.query(`SELECT "ID" FROM trips ORDER BY "ID" LIMIT 1 OFFSET $1`, [skip])
    return +res[0].ID
}

export async function get_nth_station_id(skip:number){
    const res = await AppDataSource.query(`SELECT "ID" FROM stations ORDER BY "ID" LIMIT 1 OFFSET $1`, [skip])
    return +res[0].ID
}

export async function count_journeys_for_search(patternDepartureStation:string, patternReturnStation:string){
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM trips LEFT JOIN stations as departurestation ON "Departure_station_ID" = departurestation."ID" LEFT JOIN stations as returnstation ON "Return_station_ID" = returnstation."ID" WHERE departurestation."Name" LIKE $1 AND returnstation."Name" LIKE $2`, [patternDepartureStation+'%', patternReturnStation+'%'])
    return +res[0].count
}
