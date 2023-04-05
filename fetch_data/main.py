from dotenv import dotenv_values
from pandas import DataFrame, to_datetime
from pandera import DataFrameSchema
from sqlalchemy_utils import database_exists, create_database
from population import populate_table, create_db_engine, create_tables
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
                 'Covered_distance', 'Duration']
stations.columns = ['ID', 'Name_fi', 'Name_sv', 'Name_eng', 'Address_fi', 'Address_sv', 'City_fi',
                    'City_sv', 'Operator', 'Capacity', 'x', 'y']

# Conversion from string to datetime
trips['Departure_datetime'] = to_datetime(trips['Departure_datetime'])
trips['Return_datetime'] = to_datetime(trips['Return_datetime'])
trips = trips[trips['Departure_datetime'] < trips['Return_datetime']]

# Validation schemas
trips_schema: DataFrameSchema = trips_schema(stations)
stations_schema: DataFrameSchema = stations_schema()

# Validate data
stations = validate_df(stations, stations_schema)
print("Stations validated")
trips = validate_df(trips, trips_schema)
trips = trips.dropna()
print("Trips validated")

# Set default value for city name
stations["City_fi"] = stations['City_fi'].str.strip().replace('', 'Helsinki')
stations["City_sv"] = stations['City_sv'].str.strip().replace('', 'Helsingfors')

# create database and table
config = dotenv_values()
engine = create_db_engine(config['DB_USER'], config['DB_PASSWORD'], config['DB_HOST'], config['DATABASE'])
if not database_exists(engine.url):
    create_database(engine.url)
create_tables(engine)
print("Created db and tables")

# station insertion
populate_table(engine, stations, "stations", False)
print("Stations table populated")

# trips insertion
populate_table(engine, trips, "trips", True)
print("Trips table populated")
