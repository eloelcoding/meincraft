from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# # Serve index.html as the default page
# @app.get("/")
# async def root():
#     return app.get_static_file("index.html")

# Serve static files from the "docs" directory
app.mount("/", StaticFiles(directory="docs"), name="static")


# Run the server
if __name__ == "__main__":
    port = 3000
    uvicorn.run("server:app", reload = True, host="0.0.0.0", port=port)
