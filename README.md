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

**Database**

Postgres version 14.5: \
https://www.postgresql.org/download/

**Backend and frontend**

Node version v16.17.0\
npm version 9.6.4\
Typescript Version 5.0.3\
React version 18.2.0\
express 4.18.2

**Test**

jest version 29.5.0\
supertest version  6.3.3,

## Run
Create your file dotenv and pu it in the folder &fetch data. The template is the following:
```
DB_HOST = 'localhost'
DB_PORT = 5432
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'
DATABASE = 'helsinki_bikes'
```
To start fetching the data into the database run the script fetch_data/main.py:
```python ./fetch_data/main.py```

Before starting the backend, copy paste the following environmental variables in a dotenv file
and put it inside the folder /backend.
Change user and password according to your setup

```
PORT=3006
PG_HOST='localhost'
PG_PORT=5432
PG_USER='postgres'
PG_PASSWORD='postgres'
PG_DATABASE='helsinki_bikes'
```
tHE DEFAULT PORT IS 3006, BUT IT I9S POSSIBLE TO CHOSE ANOTHER ONE BETWEEN THE AVAILABLE ONES.

To install backend dependencies and start the backend run the following commands:
```
npm install
npm run start
```

To start the frontend run:
```
npm install
npm run start
```

## Tests
The backend has been tested using Jest and Supertest.
It is possible to run all the tests with the following command:
```
npm run test
```

## Technologies choices
### Data fetch and validation
A Python script is performing this task. Python has been chosen because it's easier to manage data structure 
with this language thanks to its libraries dedicated to data analysis (pandas).\
For data validation pandera is used because it is a library that provides an easy and fast readable way 
to validate dataframe objects. (https://pandera.readthedocs.io/en/stable/).\
The check on the condition `departure date < return date` is not handled by pandera but by pandas.
The interface between python and the database is provided by SQLAlchemy (https://www.sqlalchemy.org/).

### Database
The database chosen is a PostgreSQL, a relational SQL database that fits the purpose of this project.

### Backend
For the backend it has been chosen Node, because I was curious to learn it, and it has a good support documentation being quite broadly used.
As a language I've chosen Typescript instead of Javascript to exploit the type system and have a more type-safe code and easier the coding process thanks to IDE's type hints.
The connection to the database has been implemented through TypeORM. In a first instance I was not sure if use TyperORM or Sequelize, 
but the first one seems to have a better documentation and integration with Typescript.\
In TypeORM there is the possibility of using 2 different patterns: DataMapper and ActiveRecords: in this project the second one has been chosen, since the documentation
suggest it to keep the code simple for smaller apps (https://github.com/typeorm/typeorm/blob/HEAD/docs/active-record-data-mapper.md#what-is-the-active-record-pattern).

### API Documentation 
To better implement the API documentation swagger has been used: it has a nice interface and let the user tests the route.

### Test
For testing the backend jest and supertest (for API) have been used because of their simplicity in use and good documentation.

### Frontend
In the implementation of the frontend React has been used as it is often combined with Node backend and it has a good documentation and support community.

## Software structure
### Fetch data
Features implemented:
- **data fetching**: read data from csv into dataframes
- **data cleaning**:
  - eliminated unnecessary or redundant columns (FID, Departure station name and Destination station name)
  - properly renamed columns into '_' spaced name and more readable names
- **data validation**: 
  - filter out trips that have departure date < arrival date
  - filter out trips that last less than 10 seconds or with a length < 10m
  - checking types
  - datetime format 
  - consistency where necessary (station ID present in trips must exist in stations)
- **database populating**: 
  - create database and tables
  - read the dataframe into a stream and copy the validated data into table
  
### Trip table
Columns:
- ID (int, not NULL): journey's ID
- Departure_datetime: timestamp in ISO format of departure time
- Return_datetime: timestamp in ISO format of return time
- Departure_station_ID: id of the station where the journey begins (foreign key stations.ID)
- Return_station_ID: id of the station where the journey ends (foreign key stations.ID)
- Covered_distance (float): distance in meters covered during the journey 
- Duration (int): how much time the journey lasts in seconds

### Station table
Columns:
- ID (int, not NULL): id of the station
- Name_fi: station's name in Finnish
- Name_sv: station's name in Swedish
- Name: station's name in English
- Address_fi: station's address in Finnish
- Address_sv: station's address in Swedish
- City_fi: name of the city, in Finnish, where the station is located
- City_sv: name of the city, in Swedish, where the station is located
- Operator: operator responsible for the station
- Capacity (int): number of bikes that the station can host
- x (float): x coordinate of the station
- y (float): y coordinate of the station

## Backend
The backend has 2 folders, one for the source code and the other for the tests. The tests folder structure is the same as the backend 
and the tests files has the same name of the file tha they are testing, except for the routes which tests are in the api folder.

Features implemented: reference to the API documentation http://localhost:3006/api-docs

## Frontend
### Journeys Table
Features implemented:
- List journeys: each journey has departure and return stations, covered distance in kilometers and duration in minutes
- Pagination
- Searching by name of departure station or return station

### Station Table
- List all the stations: each station has IID name, city, address, operator, capacity
- Pagination
- Searching by name
- Each row is clickable and redirect to the single station view

### Station view
- Station name
- Station address
- Total number of journeys starting from the station
- Total number of journeys ending at the station
- Station location on the map
- The average distance of a journey starting from the station
- The average distance of a journey ending at the station
- Top 5 most popular return stations for journeys starting from the station
- Top 5 most popular departure stations for journeys ending at the station
- Ability to filter all the calculations per month

## Future features implementation
For lacking of time the following features has not yet been implemented
- Add ordering for each column: to implement this feature it may be necessary to refactor the code related to the entity method that implement searching
  and use the query builder. 
- Add filtering by datetime: it may have the same problem as the order. 
They both need some more research to look for easier ways to be implemented, otherwise query builder should be used.
