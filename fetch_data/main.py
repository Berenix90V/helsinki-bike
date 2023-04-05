from pandas import DataFrame
from pandera import DataFrameSchema
from sqlalchemy_utils import database_exists, create_database
from population import populate_db, create_db_engine, create_tables
from validation import validate_df, stations_schema, trips_schema
from fetch_data import fetch_trips, fetch_stations

# Read files
trips: DataFrame = fetch_trips()
stations: DataFrame = fetch_stations()

# Eliminate redundant or obsolete information
trips.drop(['Departure station name', 'Return station name'], axis=1, inplace=True)
stations.drop(['FID'], axis=1, inplace=True)

# Fix column names
trips.columns = ['Departure_datetime', 'Return_datetime', 'Departure_station_ID', 'Return_station_ID',
                 'Covered_distance_in_m', 'Duration_in_s']
stations.columns = ['ID', 'Name_fi', 'Name_sv', 'Name_eng', 'Address_fi', 'Address_sv', 'City_fi',
                    'City_sv', 'Operator', 'Capacity', 'x', 'y']

# Validation schemas
trips_schema: DataFrameSchema = trips_schema(stations)
stations_schema: DataFrameSchema = stations_schema()

# Validate data
stations = validate_df(stations, stations_schema)
trips = validate_df(trips, trips_schema)
trips = trips.dropna()

# Set default value for city name
stations["City_fi"] = stations['City_fi'].str.strip().replace('', 'Helsinki')
stations["City_sv"] = stations['City_sv'].str.strip().replace('', 'Helsingfors')

# create database and tables
engine = create_db_engine()
if not database_exists(engine.url):
    create_database(engine.url)
create_tables(engine)

# station insertion
populate_db(engine, stations, "stations", "\t", 'utf-8', False)

# trips insertion
populate_db(engine, trips, "trips", "\t", 'utf-8', True)
