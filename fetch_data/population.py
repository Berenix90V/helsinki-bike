from io import StringIO
from pandas import DataFrame
from sqlalchemy import Table, MetaData, Column, Integer, Float, String, DateTime, ForeignKey, CheckConstraint, URL, \
    create_engine, Engine


def create_db_engine(user: str, psw: str, host: str, database: str) -> Engine:
    """
    Given the necessary parameters it returns an Engine object establishing a connection with the specified database.

    Parameters
    ----------
    user: str
        username
    psw: str
        password
    host: str
        hostname
    database: str
        database to connect to (default or an existing one)

    Returns
    -------
    engine: Engine
        An engine created with the given parameters
    """
    url_object = URL.create(
        "postgresql",
        username=user,
        password=psw,
        host=host,
        database=database,
    )
    return create_engine(url_object)


def create_tables(engine: Engine) -> None:
    """
    Given the engine it creates a MetaData object in which the tables are stored
    and then created through the create_all method that takes as parameter the engine.

    Parameters
    ----------
    engine: Engine
        engine through which is possible the connection to the database
    """
    meta = MetaData()
    trips = Table(
        'trips', meta,
        Column('ID', Integer, primary_key=True),
        Column('Departure_datetime', DateTime, nullable=False),
        Column('Return_datetime', DateTime, nullable=False),
        Column('Departure_station_ID', Integer, ForeignKey("stations.ID"), nullable=False),
        Column('Return_station_ID', Integer, ForeignKey('stations.ID'), nullable=False),
        Column('Covered_distance', Float, CheckConstraint('"Covered_distance">=10'), nullable=False),
        Column('Duration', Integer, CheckConstraint('"Duration">=10'), nullable=False)
    )
    stations = Table(
        'stations', meta,
        Column('ID', Integer, primary_key=True),
        Column('Name_fi', String),
        Column('Name_sw', String),
        Column('Name', String),
        Column('Address_fi', String),
        Column('Address_sw', String),
        Column('City_fi', String, default="Helsinki", nullable=False),
        Column('City_sw', String, default="Helsingfors", nullable=False),
        Column('Operator', String),
        Column('Capacity', Integer),
        Column('x', Float),
        Column('y', Float)
    )
    meta.create_all(engine)


def populate_table(engine: Engine, df: DataFrame, table: str, index: bool) -> None:
    """
    Given the connection, the data and the table, it populates the table with the data through a copy.
    If the index is True one more column that keep the row number will be inserted, otherwise not.

    Parameters
    ----------
    engine: Engine
        engine connection to the database
    df: DataFrame
        data to insert in the table
    table: str
        name of the table in the database in which to copy the data
    index: bool
        if True add an ID column with the row number
    """
    # data preparation
    output = StringIO()
    df.to_csv(output, sep='\t', header=False, encoding='utf8', index=index)
    output.seek(0)
    # insert data
    connection = engine.raw_connection()
    cursor = connection.cursor()
    cursor.copy_from(output, table, sep='\t', null='')
    connection.commit()
    cursor.close()
