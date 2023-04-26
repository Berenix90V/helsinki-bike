import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity({ name: "trips"})
export class Journey extends BaseEntity{
    @PrimaryColumn()
    declare  ID:number
    @Column()
    declare Departure_datetime: Date
    @Column()
    declare Return_datetime: Date
    @Column()
    declare Departure_station_ID:number
    @Column()
    declare Return_station_ID: number
    @Column()
    declare Covered_distance: number
    @Column()
    declare Duration: number

    static async fetchAll(): Promise<Journey[]>{
        return await Journey.find({
            skip: 0,
            take: 100
        })
}

}