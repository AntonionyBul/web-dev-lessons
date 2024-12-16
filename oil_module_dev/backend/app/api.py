from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

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

@app.get("/todo", tags=["todos"])
async def get_todos() -> dict:
    return { "get log": "123" }


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):

    return {"filename": file.filename}

@app.post("/q")
async def root(data: Request):
    try:
        res = await data.json()
    except Exception as ex:
        res = str(ex)
    print(res)
    return res