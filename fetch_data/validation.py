from datetime import datetime

from pandas import DataFrame
from pandera.errors import SchemaErrors
from pandera import DataFrameSchema, Column, Check


def stations_schema() -> DataFrameSchema:
    """
    It provides the validation for the stations.
    it checks the types and that the ID is a valid ID (not NULL and does not repeat)

    Returns
    -------
    stations_schema: DataFrameSchema
        the stations schema with all the rules to validate trips
    """
    return DataFrameSchema({
        'ID': Column(int, nullable=False),
        'Name_fi': Column(str),
        'Name_sv': Column(str),
        'Name_eng': Column(str),
        'Address_fi': Column(str),
        'Address_sv': Column(str),
        'City_fi': Column(str),
        'City_sv': Column(str),
        'Operator': Column(str),
        'Capacity': Column(int),
        'x': Column(float),
        'y': Column(float)
    })


def trips_schema(stations: DataFrame) -> DataFrameSchema:
    """
    It provides the validation schema for trips.
    Conditions:
    - trip's length >= 10m
    - trip's duration >= 10s
    - station ID columns not NULL and ID is a valid station ID (present in stations['ID'])

    Parameters
    ----------
    stations: DataFrame
        dataframe containing all the stations with their IDs

    Returns
    -------
    trips_schema: DataFrameSchema
        the trips schema with all the rules to validate trips
    """
    return DataFrameSchema({
        'Departure_datetime': Column(datetime),
        'Return_datetime': Column(datetime),
        'Departure_station_ID': Column(int, Check.isin(stations['ID']), nullable=False),
        'Return_station_ID': Column(int, Check.isin(stations['ID']), nullable=False),
        'Covered_distance': Column(float, Check.greater_than_or_equal_to(10.0)),
        'Duration': Column(int, Check.greater_than_or_equal_to(10))
    })


def validate_df(df: DataFrame, schema: DataFrameSchema) -> DataFrame:
    """
    given the schema and the dataframe it executes the validation and returns a dataframe with all the valid records.

    Parameters
    ----------
    df: DataFrame
        dataframe to be validated
    schema: DataFrameSchema
        schema to apply to the dataframe

    Returns
    -------
    valid_df: DataFrame
        the dataframe with the record that have passed the validation
    """
    fail_index: list = []
    try:
        df = schema.validate(df, lazy=True)
    except SchemaErrors as err:
        fail_index = err.failure_cases['index']
    finally:
        df = df[~df.index.isin(fail_index)]
    return df
