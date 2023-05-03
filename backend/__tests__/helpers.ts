import {AppDataSource} from "../src/db/data-sources";

export async function count_stations_instances(){
    const data = await AppDataSource.query(`SELECT count(*) FROM stations`)
    return +data[0].count
}
