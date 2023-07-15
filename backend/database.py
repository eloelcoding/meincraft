import sqlite3

class Database:
    def __init__(self):
        self.conn = None

    def get_connection(self):
        if not self.conn:
            self.conn = sqlite3.connect("backend/data/maps.db")
        return self.conn

    def close_connection(self):
        if self.conn:
            self.conn.close()
            self.conn = None

    def create_table(self):
        conn = self.get_connection()
        c = conn.cursor()
        print("Creating database if necessary")
        c.execute("CREATE TABLE IF NOT EXISTS maps (encoded_map TEXT, name TEXT PRIMARY KEY)")
        conn.commit()
        c.close()

    def save_map(self, map_data):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute("INSERT OR REPLACE INTO maps (encoded_map, name) VALUES (?, ?)", (map_data.encodedMap, map_data.name))
        conn.commit()
        c.close()

    def load_map(self, name):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute("SELECT encoded_map FROM maps WHERE name=?", (name,))
        result = c.fetchone()
        if result:
            return result[0]
        else:
            return None

    def get_map_names(self):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute("SELECT name FROM maps")
        results = c.fetchall()
        map_names = [result[0] for result in results]
        return map_names
