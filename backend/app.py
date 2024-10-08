from flask import Flask, render_template, url_for,request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import credentials
# config is the python file used to store credentials.


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']= credentials
db=SQLAlchemy(app)

# Define the User model
class User(db.Model):
    __tablename__ = 'test1'
    UserId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password_hash=db.Column(db.String(100),nullable=False,unique=True)
    email = db.Column(db.String(100), nullable=False)
    CreateAt = db.Column(db.DateTime, nullable=False)

@app.route('/',methods=['POST','GET'])
def index(consoleInfo=""):
    db.create_all()
    return render_template("index.html",title="User input",consoleInfo=consoleInfo)

@app.route('/submit',methods=['POST'])
def submit():
  username=request.form['username']
  password_hash=request.form['password_hash']
  email=request.form['email']

  current_time = datetime.now()
  CreateAt=current_time.strftime("%Y-%m-%d %H:%M:%S")

  new_user = User(username=username,password_hash=password_hash
                  ,email=email,CreateAt=CreateAt)
  try:
    db.session.add(new_user)
    db.session.commit() 
    return index(consoleInfo="last input was successful")
  except:
     print(f"Either {username} is used or the value entered is illegal.")
     return index(consoleInfo="last input was not successful")

if __name__=="__main__":
  app.run(debug=True)


    