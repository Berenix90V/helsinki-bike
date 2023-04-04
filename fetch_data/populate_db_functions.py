from io import StringIO
from pandas import DataFrame
from sqlalchemy import Table, MetaData, Column, Integer, Float, String, DateTime, ForeignKey, CheckConstraint


def populate_db(engine, df: DataFrame, table: str, sep='\t', encoding='utf8', index=True) -> None:
    # data preparation
    output = StringIO()
    df.to_csv(output, sep=sep, header=False, encoding=encoding, index=index)
    output.seek(0)
    # insert data
    connection = engine.raw_connection()
    cursor = connection.cursor()
    cursor.copy_from(output, table, sep=sep, null='')
    connection.commit()
    cursor.close()


def return_trips_table(meta: MetaData) -> Table:
    return Table(
        'trips', meta,
        Column('ID', Integer, primary_key=True),
        Column('Departure_datetime', DateTime),
        Column('Return_datetime', DateTime),
        Column('Departure_station_ID', Integer, ForeignKey("stations.ID"), nullable=False),
        Column('Return_station_ID', Integer, ForeignKey('stations.ID'), nullable=False),
        Column('Covered_distance_in_m', Float, CheckConstraint('"Covered_distance_in_m">=10')),
        Column('Duration_in_s', Integer, CheckConstraint('"Duration_in_s">=10'))
    )


def return_stations_table(meta: MetaData) -> Table:
    return Table(
        'stations', meta,
        Column('ID', Integer, primary_key=True),
        Column('Name_fi', String),
        Column('Name_sv', String),
        Column('Name', String),
        Column('Address_fi', String),
        Column('Address_sv', String),
        Column('City_fi', String, default="Helsinki", nullable=False),
        Column('City_sv', String, default="Helsingfors", nullable=False),
        Column('Operator', String),
        Column('Capacity', Integer),
        Column('x', Float),
        Column('y', Float)
    )
