import {AppDataSource} from "./data-sources";

export function connect_to_db(){
    AppDataSource
        .initialize()
        .then(()=>{
            console.log("data source has been initialized")
        })
        .catch((err)=>{
            console.log("Error during data source initialization", err)
        })
}