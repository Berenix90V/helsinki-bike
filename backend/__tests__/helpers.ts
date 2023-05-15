import {AppDataSource} from "../src/db/data-sources";

export async function count_stations_instances():Promise<number>{
    const data = await AppDataSource.query(`SELECT count(*) FROM stations`)
    return +data[0].count
}

export async function count_journeys_instances(): Promise<number>{
    const data = await AppDataSource.query(`SELECT count(*) FROM trips`)
    return +data[0].count
}

export async function get_nth_journey_id(skip:number): Promise<number>{
    const res = await AppDataSource.query(`SELECT "ID" FROM trips ORDER BY "ID" LIMIT 1 OFFSET $1`, [skip])
    return +res[0].ID
}

export async function get_nth_station_id(skip:number): Promise<number>{
    const res = await AppDataSource.query(`SELECT "ID" FROM stations ORDER BY "ID" LIMIT 1 OFFSET $1`, [skip])
    return +res[0].ID
}

export async function count_journeys_for_search(patternDepartureStation:string, patternReturnStation:string): Promise<number>{
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM trips LEFT JOIN stations as departurestation ON "Departure_station_ID" = departurestation."ID" LEFT JOIN stations as returnstation ON "Return_station_ID" = returnstation."ID" WHERE departurestation."Name" LIKE $1 AND returnstation."Name" LIKE $2`, [patternDepartureStation+'%', patternReturnStation+'%'])
    return +res[0].count
}

export async function count_journeys_from_station(id:number): Promise<number>{
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM trips WHERE "Departure_station_ID" = $1 `, [id])
    return +res[0].count
}

export async function count_journeys_from_station_filter_by_month(id:number, month:number):Promise<number>{
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM trips WHERE "Departure_station_ID" = $1 AND EXTRACT(MONTH FROM "Departure_datetime")=$2`, [id, month])
    return +res[0].count
}

export async function count_journeys_to_station(id:number){
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM trips WHERE "Return_station_ID" = $1 `, [id])
    return +res[0].count
}

export async function count_journeys_to_station_filter_by_month(id:number, month:number):Promise<number>{
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM trips WHERE "Return_station_ID" = $1 AND EXTRACT(MONTH FROM "Return_datetime")=$2`, [id, month])
    return +res[0].count
}


export async function count_stations_for_search(patternName:string): Promise<number>{
    const res = await AppDataSource.query(`SELECT COUNT(*) FROM stations WHERE "Name" LIKE $1`, [patternName])
    return +res[0].count
}

export async function avg_distance_journeys_from_station(id:number):Promise<number>{
    const res = await AppDataSource.query('SELECT AVG("Covered_distance") FROM trips WHERE "Departure_station_ID"=$1', [id])
    return +res[0].avg
}

export async function avg_distance_journeys_from_station_filtered_by_month(id:number, month:number){
    const res = await AppDataSource.query(`SELECT AVG(trips."Covered_distance") FROM trips WHERE "Departure_station_ID"=$1 AND extract(month from "Departure_datetime")=$2`, [id, month])
    return +res[0].avg
}

export async function avg_distance_journeys_to_station(id:number):Promise<number>{
    const res = await AppDataSource.query('SELECT AVG("Covered_distance") FROM trips WHERE "Return_station_ID"=$1', [id])
    return +res[0].avg
}

export async function avg_distance_journeys_to_station_filtered_by_month(id:number, month:number){
    const res = await AppDataSource.query(`SELECT AVG(trips."Covered_distance") FROM trips WHERE "Return_station_ID"=$1 AND extract(month from "Return_datetime")=$2`, [id, month])
    return +res[0].avg
}


export async function top_n_destinations(id:number, limit:number){
    return await AppDataSource.query('SELECT COUNT("Return_station_ID"), "Return_station_ID", "Name" FROM trips LEFT JOIN stations ON "Return_station_ID"=stations."ID" WHERE "Departure_station_ID"=$1 group by "Return_station_ID", "Name" ORDER BY  count("Return_station_ID") DESC LIMIT $2', [id, limit])
}

export async function top_n_destinations_filtered_by_month(id:number, limit:number, month:number){
    return await AppDataSource.query('SELECT COUNT("Return_station_ID"), "Return_station_ID", "Name" FROM trips LEFT JOIN stations ON "Return_station_ID"=stations."ID" WHERE "Departure_station_ID"=$1 AND extract(month from "Departure_datetime")=$2 group by "Return_station_ID", "Name" ORDER BY  count("Return_station_ID") DESC LIMIT $3', [id, month, limit])
}

export async function top_n_departures(id:number, limit:number){
    return await AppDataSource.query('SELECT COUNT("Departure_station_ID"), "Departure_station_ID", "Name" FROM trips LEFT JOIN stations ON "Departure_station_ID"=stations."ID" WHERE "Return_station_ID"=$1 group by "Departure_station_ID", "Name" ORDER BY  count("Departure_station_ID") DESC LIMIT $2', [id, limit])
}

export async function top_n_departures_filtered_by_month(id:number, limit:number, month:number){
    return await AppDataSource.query('SELECT COUNT("Departure_station_ID"), "Departure_station_ID", "Name" FROM trips LEFT JOIN stations ON "Departure_station_ID"=stations."ID" WHERE "Return_station_ID"=$1 AND extract(month from "Return_datetime")=$2 group by "Departure_station_ID", "Name" ORDER BY  count("Departure_station_ID") DESC LIMIT $3', [id, month, limit])
}