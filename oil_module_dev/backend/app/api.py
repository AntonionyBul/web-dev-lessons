from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from app.parser_setter import adjust
from datetime import timedelta, datetime
app = FastAPI()

class adjustParams:
    def __init__(self, wells, dates, limits):
        self.wells = wells
        self.dates = dates
        self.limits = limits

adjust_params = adjustParams([],[],[])

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

    for i in res:
        start_date = datetime.strptime(i['date1'], '%Y-%m-%d')
        if (i['date2']):
        
            end_date = datetime.strptime(i['date2'], '%Y-%m-%d')
            deltadt = end_date - start_date+ timedelta(days=1)
            for j in range(0, deltadt.days):
                adjust_params.dates.append(start_date.strftime('%Y-%d-%m %H:%M:%S'))
                start_date = start_date + timedelta(days=1)
                adjust_params.limits.append(float(i['number']))
        else:
            adjust_params.dates.append(start_date.strftime('%Y-%d-%m %H:%M:%S'))
            adjust_params.limits.append(float(i['number']))
    return res

@app.post("/uploadwells")
async def root(data: Request):
    try:
        res = await data.json()
    except Exception as ex:
        res = str(ex)
    for i in res:
        adjust_params.wells.append('Well_'+str(i))
    return res

@app.post("/uploadfiles")

async def upload_file(file: UploadFile = File(...)):

    file_location = os.path.join('./app', file.filename)


    # Save the uploaded file to the specified location

    with open(file_location, "wb") as file_object:

        file_object.write(await file.read())

    os.rename('./app/'+file.filename, './app/input.xlsx')    
    adjust(adjust_params.wells, adjust_params.dates, adjust_params.limits)
    return {
        
        "filename": file.filename,

        "content_type": file.content_type,

    }

@app.get("/file/download")
def download_file():
  return FileResponse(path='./app/output.xlsx', filename='output.xlsx', media_type='multipart/form-data')