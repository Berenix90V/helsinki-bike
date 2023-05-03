import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Journey} from "./Journey";

@Entity({name: "stations", synchronize:false})
export class Station extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    declare ID: number

    @Column({
        type: "varchar",
        length: 100
    })
    declare Name_fi: string

    @Column({
        type: "varchar",
        length: 100
    })
    declare Name_sw: string

    @Column({
        type: "varchar",
        length: 100
    })
    declare Name: string

    @Column({
        type: "text",
    })
    declare Address_fi: string

    @Column({
        type: "text"
    })
    declare Address_sw: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare City_fi: string

    @Column({
        type: "varchar",
        length: 100
    })
    declare City_sw: string

    @Column({
        type: "varchar",
        length: 100,
        nullable:false
    })
    declare Operator: string

    @Column({
        type:"int"
    })
    declare Capacity: number

    @Column({
        type: "float",
        nullable:false
    })
    declare x: number

    @Column({
        type: "float",
        nullable:false
    })
    declare y: number

    @OneToMany(() => Journey, journey=> journey.Departure_station)
    declare Departure_journeys: Journey[]

    @OneToMany(() => Journey, journey=> journey.Return_station)
    declare Return_journeys: Journey[]

    static async fetchAll(): Promise<Station[]>{
        return await Station.find()
    }
}