from sqlalchemy import create_engine, text
import pandas as pd

class Database:
    def __init__(self, url):
        self.url = url
        self.engine = None

    def get_connection(self):
        if not self.engine:
            self.engine = create_engine(self.url)
        return self.engine

    def __del__(self):
        self.engine.dispose()
        
    def query(self, query, params = None):
        if params is None:
            params = {} 
        print(f"Running query [{query}] with params = {params}")
        engine = self.get_connection()
        print(query, params)
        return pd.read_sql(query, engine, params=params)
    
    def execute_query(self, query, params = None):
        if params is None:
            params = {} 
        print(f"Executing query [{query}] with params = {params}")
        engine = self.get_connection()
        conn = engine.connect()
        conn.execute(text(query), params)
        conn.commit()

    def create_table(self, drop = False):
        print("Creating database if necessary")
        if drop:
            self.execute_query("DROP TABLE IF EXISTS maps")
        create_query = "CREATE TABLE IF NOT EXISTS maps (encoded_map TEXT, name TEXT PRIMARY KEY)"
        self.execute_query(create_query)

    def save_map(self, map_data):
        save_query = "INSERT OR REPLACE INTO maps (encoded_map, name) VALUES (:encodedMap,:name)"
        self.execute_query(save_query, map_data)

    def load_map(self, name):
        results = self.query(f"SELECT encoded_map FROM maps WHERE name=:name", {'name': name})
        if len(results):
            return results.loc[0,'encoded_map']
        else:
            raise Exception("Could not load map")

    def get_map_names(self):
        results = self.query("SELECT name FROM maps")
        return list(results['name'])

if __name__ == "__main__":
    db = Database('sqlite:///backend/data/maps2.db')
    print(db.create_table())
    print(db.get_map_names())
    print(db.load_map('map1'))