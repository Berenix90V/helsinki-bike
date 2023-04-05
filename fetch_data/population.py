from io import StringIO
from dotenv import dotenv_values
from pandas import DataFrame
from sqlalchemy import Table, MetaData, Column, Integer, Float, String, DateTime, ForeignKey, CheckConstraint, URL, \
    create_engine, Engine


def create_db_engine() -> Engine:
    config = dotenv_values()
    url_object = URL.create(
        "postgresql",
        username=config['DB_USER'],
        password=config['DB_PASSWORD'],
        host=config['DB_HOST'],
        database=config['DATABASE'],
    )
    return create_engine(url_object)


def create_tables(engine) -> None:
    meta = MetaData()
    trips = Table(
        'trips', meta,
        Column('ID', Integer, primary_key=True),
        Column('Departure_datetime', DateTime),
        Column('Return_datetime', DateTime),
        Column('Departure_station_ID', Integer, ForeignKey("stations.ID"), nullable=False),
        Column('Return_station_ID', Integer, ForeignKey('stations.ID'), nullable=False),
        Column('Covered_distance_in_m', Float, CheckConstraint('"Covered_distance_in_m">=10')),
        Column('Duration_in_s', Integer, CheckConstraint('"Duration_in_s">=10'))
    )
    stations = Table(
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
    meta.create_all(engine)


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
