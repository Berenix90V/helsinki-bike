import React from "react";
import {StationsTable} from "../components/StationsTable";

function StationsView(){
    return(
        <>
            <h1 className="text-center">Stations table</h1>
            <StationsTable/>
        </>
    )
}
export {StationsView}