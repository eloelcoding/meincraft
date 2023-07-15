from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
from database import Database

app = FastAPI()

URL = 'sqlite:///backend/data/maps.db'
db = Database(URL)
db.create_table()

# Define a model for the map data
class Map(BaseModel):
    encodedMap: str
    name: str


# Save a map to the database
@app.post("/api/map")
def save_map(map_data: Map):
    db = Database(URL)
    db.save_map(map_data)
    return {"message": "Map saved successfully"}

# Load a map from the database by name
@app.get("/api/map/{name}")
def load_map(name: str):
    db = Database(URL)
    encoded_map = db.load_map(name)
    if encoded_map:
        return {"encodedMap": encoded_map}
    else:
        return {"message": "Map not found"}

# List all map names
@app.get("/api/maps")
def list_map_names():
    db = Database(URL)
    map_names = db.get_map_names()
    return {"mapNames": map_names}

# Serve index.html as the default page
# @app.get("/")
# async def root():
#     return app.get_static_file("index.html")

# Serve static files from the "docs" directory
app.mount("/", StaticFiles(directory="docs"), name="static")



# Run the server
if __name__ == "__main__":
    port = 3000
    uvicorn.run("server:app", reload = True, host="0.0.0.0", port=port)
