# helsinki-bike
Web application to visualize data about journeys of city bikes in Helsinki

## Prerequisites
### Software versions
Python version 3.9.13

**Python packages**:
- pandera version 0.13.4
- python-dotenv version 0.21.1
- sqlalchemy version 2.0.0
- sqlalchemy-utils version 0.40.0

```pip install pandera python-dotenv SQLAlchemy sqlalchemy-utils```

Postgres version 14.5: 
https://www.postgresql.org/download/

## Configurations

## Run
To start fetching the data into the database run the script fetch_data/main.py:
```python ./fetch_data/main.py```


## Tests

## Technologies
### Data fetch and validation
A Python script is performing this task. Python has been chosen because it's easier to manage data structure 
with this language thanks to its libraries dedicated to data analysis (pandas).\
For data validation pandera is used becaause it is a library that provides an easy and fast readable way 
to validate dataframe objects. (https://pandera.readthedocs.io/en/stable/).\
The interface between python and the database is provided by SQLAlchemy (https://www.sqlalchemy.org/).
### Database
The database chosen is a PostgreSQL, a relational SQL database that fits the purpose of this project.
### Backend
Backend: Node js, Typescript
Frontend: React

## Software structure
### Fetch data
Features implemented:
- **data fetching**: read data from csv into dataframes
- **data cleaning**:
  - eliminated unnecessary or redundant columns (FID, Departure station name and Destination station name)
  - properly renamed columns into '_' spaced name and more readable names
- **data validation**: 
  - filter out trips that last less than 10 seconds or with a length < 10m
  - checking types
  - datetime format 
  - consistency where necessary (station ID present in trips must exist in stations)
- **database populating**: 
  - create database and tables
  - read the dataframe into a stream and copy the validated data into table


