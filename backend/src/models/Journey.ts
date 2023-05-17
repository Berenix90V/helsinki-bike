import {BaseEntity, Column, Entity, JoinColumn, Like, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Station} from "./Station";

@Entity({ name: "trips", synchronize:false})
export class Journey extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    declare  ID:number

    @Column({
        type: "timestamp",
        nullable: false
    })
    declare Departure_datetime: Date

    @Column({
        type: "timestamp",
        nullable:false
    })
    declare Return_datetime: Date

    @ManyToOne(() => Station, station => station.Departure_journeys)
    @JoinColumn({name:"Departure_station_ID"})
    declare Departure_station:Station

    @ManyToOne(() => Station, station => station.Return_journeys)
    @JoinColumn({name:"Return_station_ID"})
    declare Return_station: Station

    @Column({
        type: "float",
        nullable: false
    })
    declare Covered_distance: number

    @Column({
        type: "int",
        nullable:false
    })
    declare Duration: number

    static async countTotal():Promise<number>{
        return await Journey.count({
            cache:true
        })
    }

    static async getPaginatedJourneys(skip=0, take=100): Promise<Journey[]>{
        const totalJourneys = await Journey.countTotal()
        if (take<=0){
            throw RangeError("Bad request: The number of required objects must be > 0")
        }
        if (skip<0){
            throw RangeError("Bad request: The beginning point must be >= 0")
        }
        if (skip>=totalJourneys){
            throw RangeError("Bad request: The beginning point must be < total records")
        }
        return await Journey.find({
            relations: {
                Departure_station: true,
                Return_station: true
            },
            order:{
                ID:"ASC"
            },
            skip: skip,
            take: take
        })
    }

    static async getNumberOfJourneysFromStation(id:number, month?:number):Promise<number>{
        if (id<=0){
            throw RangeError("Bad request: ID must be > 0")
        }
        if(month!==undefined)
            if(month<1 || month >12)
                throw RangeError("Month not valid")
            else
                return await Journey
                    .createQueryBuilder('trips')
                    .select("Departure_station_ID")
                    .where("trips.Departure_station_ID = :id AND EXTRACT(MONTH FROM trips.Departure_datetime) = :month ", { id: id, month:month})
                    .getCount()
        else
            return await Journey
                .createQueryBuilder('trips')
                .select("Departure_station_ID")
                .where("trips.Departure_station_ID = :id", { id: id})
                .getCount()
    }

    static async getNumberOfJourneysToStation(id:number, month?:number):Promise<number>{
        if (id<=0){
            throw RangeError("Bad request: ID must be > 0")
        }
        if(month !==undefined)
            if(month<1 || month >12)
                throw RangeError("Month not valid")
            else
                return await Journey
                    .createQueryBuilder('trips')
                    .select("Return_station_ID")
                    .where("trips.Return_station_ID = :id AND EXTRACT(MONTH FROM trips.Return_datetime)=:month", { id: id, month:month})
                    .getCount()
        else
            return await Journey
                .createQueryBuilder('trips')
                .select("Return_station_ID")
                .where("trips.Return_station_ID = :id", { id: id})
                .getCount()
    }

    static async countJourneysForSearch(patternDepartureStation:string, patternReturnStation:string): Promise<number>{
        patternDepartureStation = patternDepartureStation +'%'
        patternReturnStation = patternReturnStation + '%'
        return await Journey.count({
            relations:{
                Departure_station: true
            },
            where:{
                Departure_station:{
                    Name: Like(patternDepartureStation)
                },
                Return_station:{
                    Name: Like(patternReturnStation)
                }
            }
        })
    }

    static async getPaginatedJourneysForSearch(skip:number, take:number, patternDepartureStation:string, patternReturnStation:string): Promise<Journey[]>{
        const totalJourneys = await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
        if (take<=0){
            throw RangeError("Bad request: The number of required objects must be > 0")
        }
        if (skip<0){
            throw RangeError("Bad request: The beginning point must be >= 0")
        }
        if (skip !=0 && skip>=totalJourneys){
            throw RangeError("Bad request: The beginning point must be < total records")
        }
        return await Journey.find({
            relations:{
                Departure_station: true,
                Return_station: true
            },
            skip: skip,
            take: take,
            where:{
                Departure_station: {
                    Name:Like(patternDepartureStation+"%")
                },
                Return_station:{
                    Name: Like(patternReturnStation+"%")
                }
            }
        })
    }

    static async getAverageDistanceFrom(id:number, month?:number): Promise<number>{
        if(id<=0)
            throw RangeError("ID must be >= 0 ")
        let response:{avg:number}|undefined
        if(month !== undefined)
            if(month < 1 || month > 12)
                throw RangeError("Month not valid")
            else
                response = await Journey
                    .createQueryBuilder('trips')
                    .select('AVG("Covered_distance")')
                    .where("trips.Departure_station_ID = :id AND EXTRACT(MONTH FROM trips.Departure_datetime) = :month", { id: id, month:month})
                    .getRawOne();
        else
            response = await Journey
                .createQueryBuilder('trips')
                .select('AVG("Covered_distance")')
                .where("trips.Departure_station_ID = :id", { id: id})
                .getRawOne();
        if(response === undefined)
            throw Error("Query not performed")
        else
            if(response.avg == null)
                return 0
            else
                return response.avg
    }

    static async getAverageDistanceTo(id:number, month?:number): Promise<number>{
        if(id<=0)
            throw RangeError("ID must be >= 0 ")
        let response: {avg:number}|undefined
        if(month !== undefined)
            if(month < 1 || month > 12)
                throw RangeError("Month not valid")
            else
                response = await Journey
                    .createQueryBuilder('trips')
                    .select('AVG("Covered_distance")')
                    .where("trips.Return_station_ID = :id AND EXTRACT(MONTH FROM trips.Return_datetime) = :month", { id: id, month:month})
                    .getRawOne();
        else
            response = await Journey
                .createQueryBuilder('trips')
                .select('AVG("Covered_distance")')
                .where("trips.Return_station_ID = :id", { id: id})
                .getRawOne();
        if(response === undefined)
            throw Error("Query not performed")
        else
            if(response.avg == null)
                return 0
            else
                return response.avg
    }

    static async getTopNDestinations(id:number, limit:number, month?:number): Promise<{count:number, Return_station_ID:number, Name:string}[]>{
        if(id<=0)
            throw RangeError("ID must be >= 0 ")
        if(limit<0)
            throw RangeError("Required number of journeys must be >= 0 ")
        if(limit==0)
            return []
        if(month!==undefined)
            if(month<1 || month >12)
                throw RangeError("Month not valid")
            else
                return await Journey
                    .createQueryBuilder("journey")
                    .innerJoin("journey.Return_station", "Return_station")
                    .select("journey.Return_station_ID, Return_station.Name")
                    .addSelect("COUNT(journey.Return_station_ID)", "count")
                    .where("journey.Departure_station_ID = :id AND EXTRACT(MONTH FROM journey.Departure_datetime) = :month", { id: id, month:month})
                    .groupBy("journey.Return_station_ID, Return_station.Name")
                    .orderBy("count", "DESC")
                    .limit(limit)
                    .getRawMany()
        else
            return await Journey
                .createQueryBuilder("journey")
                .innerJoin("journey.Return_station", "Return_station")
                .select("journey.Return_station_ID, Return_station.Name")
                .addSelect("COUNT(journey.Return_station_ID)", "count")
                .where("journey.Departure_station_ID = :id", { id: id})
                .groupBy("journey.Return_station_ID, Return_station.Name")
                .orderBy("count", "DESC")
                .limit(limit)
                .getRawMany()
    }

    static async getTopNDepartures(id:number, limit:number, month?:number):Promise<{count:number, Departure_station_ID:number, Name:string}[]>{
        if(id<=0)
            throw RangeError("ID must be >= 0 ")
        if(limit<0)
            throw RangeError("Required number of journeys must be >= 0 ")
        if(limit==0)
            return []
        if(month !== undefined)
            if(month<1 || month >12)
                throw RangeError('Month not valid')
            else
                return await Journey
                    .createQueryBuilder("journey")
                    .innerJoin("journey.Departure_station", "Departure_station")
                    .select("journey.Departure_station_ID, Departure_station.Name")
                    .addSelect("COUNT(journey.Departure_station_ID)", "count")
                    .where("journey.Return_station_ID = :id AND EXTRACT(MONTH FROM journey.Return_datetime) = :month", { id: id, month:month})
                    .groupBy("journey.Departure_station_ID, Departure_station.Name")
                    .orderBy("count", "DESC")
                    .limit(limit)
                    .getRawMany()
        else
            return await Journey
                .createQueryBuilder("journey")
                .innerJoin("journey.Departure_station", "Departure_station")
                .select("journey.Departure_station_ID, Departure_station.Name")
                .addSelect("COUNT(journey.Departure_station_ID)", "count")
                .where("journey.Return_station_ID = :id", { id: id})
                .groupBy("journey.Departure_station_ID, Departure_station.Name")
                .orderBy("count", "DESC")
                .limit(limit)
                .getRawMany()
    }
}