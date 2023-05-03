import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "stations"})
export class Station extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    declare ID: number

    @Column({
        type: "varchar",
        length: 100,
    })
    declare Name_fi: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare Name_sv: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare Name: string

    @Column({
        type: "text"
    })
    declare Address_fi: string

    @Column({
        type: "text"
    })
    declare Address_sv: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare City_fi: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare City_sv: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare Operator: string

    @Column({
        type:"int"
    })
    declare Capacity: number

    @Column({
        type: "float"
    })
    declare x: number

    @Column({
        type: "float"
    })
    declare y: number
}