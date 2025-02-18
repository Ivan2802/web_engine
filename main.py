from fastapi import FastAPI
from fastapi import Depends, Body, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import *

app = FastAPI()

Base.metadata.create_all(bind=engine)
def get_db():
    db = LocalSession()
    try: yield db
    finally: db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"] 
)

@app.post('/api/add_user')
async def add_user(data = Body(), db: Session = Depends(get_db)):
    user = User(
        name = data['name'],
        email = data['email'],
        password = data['password']
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post('/api/check_is_user_exist')
async def add_user(data = Body(), db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data['email']).first() != None:
        return {'message': 'error'}
    return {'message': 'ok'}

@app.post('/api/get_user')
async def get_user(data = Body(), db: Session = Depends(get_db)):
    user = {'name': '','id': '', 'password': '', 'message': ''}
    if db.query(User).filter(User.name == data['name']).first() != None and db.query(User).filter(User.password == data['password']).first() != None:
        user['name'] = encode64(data['name'])
        user['id'] = db.query(User).filter(User.name == data['name']).first().id
        user['password'] = encode64(db.query(User).filter(User.name == data['name']).first().password)
        user['message'] = 'ok'
    else: return {'message':'error'}
    return user

import base64
def encode64(string):
    return base64.b64encode(string.encode('utf-8'))
def decode64(string):
    return base64.b64decode(string.encode('utf-8')).decode('utf-8')

# import json


# Функция создания файла сайта и его имени # уникальное название из-за id в DB User
def create_filename(user_name, user_id, site_id):
    file_name = str(user_id) + str(user_name) + str(site_id)
    file_name = file_name.replace('=', '')
    return file_name
def create_file(file_name, site_name):
    with open(f'./src/user_sites/{file_name}.html', 'w') as file:
        file.write(f'''<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>{site_name}</title>
                        </head>
                        <body>
                            
                        </body>
                        </html>''')

@app.post('/api/create_site')
async def create_site(data = Body(), db: Session = Depends(get_db)):
    user_name = data['user']['name']
    user_password = data['user']['password']
    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)
        site = Site(name = data['name'], status = data['status'], template = data['template'], link = data['link'], user = user_id)
        db.add(site)
        db.commit()
        db.refresh(site)

        # !!! Локальная ссылка
        fn =  create_filename(user_name, user_id, site.id)

        site.link = f'file:///C:/Users/Иваныч/Desktop/Engine/src/user_sites/{fn}.html'
        db.commit()
        db.refresh(site)

        # Создание файла с сайтом
        create_file(fn, site.name)

    else: return {'message':'error'}
    return site

@app.post('/api/get_user_data_for_profile')
def get_user_data_for_profile(data = Body(), db: Session = Depends(get_db)):
    user_name = data['user']['name']
    user_password = data['user']['password']
    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)
        sites = [site for site in db.query(Site).filter(Site.user == user_id)]
    else: return {'message':'error'}
    return sites





@app.post('/api/set_site')
def set_site(data = Body(), db: Session = Depends(get_db)):
    name = data['name']
    status = db.query(Site).filter(Site.name == data['name']).first().status
    mini_set_site = {'name': name, 'status': status}
    return mini_set_site



@app.post('/api/change_settings')
def set_site(data = Body(), db: Session = Depends(get_db)):
    name_old = data['name_old']
    name_new = data['name_new']
    site = db.query(Site).filter(Site.name == name_old).first()
    site.name = name_new
    db.commit()
    return {'message':'ok'}

@app.post('/api/delete_site')
def set_site(data = Body(), db: Session = Depends(get_db)):
    name_old = data['name_old']
    site = db.query(Site).filter(Site.name == name_old).first()
    db.delete(site)
    db.commit()
    return {'message':'ok'}




@app.post('/api/get_site_id_fromDB')
def get_site_id_fromDB(data = Body(), db: Session = Depends(get_db)):
    name = data['name']
    site = db.query(Site).filter(Site.name == name).first()
    return site