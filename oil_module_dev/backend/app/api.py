from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from app.parser_setter import adjust
app = FastAPI()



origins = [
    "http://localhost:8080",
    "localhost:8080",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome"}

@app.post("/uploadlimits")
async def root(data: Request):
    try:
        res = await data.json()
    except Exception as ex:
        res = str(ex)
    print(res)
    return res


@app.post("/uploadfiles")

async def upload_file(file: UploadFile = File(...)):

    file_location = os.path.join('./', file.filename)


    # Save the uploaded file to the specified location

    with open(file_location, "wb") as file_object:

        file_object.write(await file.read())

    
    # adjust(wells, dates, limits)    

    return {

        "filename": file.filename,

        "content_type": file.content_type,

        "size": os.path.getsize(file_location)

    }

