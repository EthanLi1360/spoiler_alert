from . import *

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def chech_password(hashed_password, user_input_password):
   return bcrypt.checkpw(user_input_password.encode('utf-8'), hashed_password)

# Define the User model
class User(db.Model):
    __tablename__ = 'test1'
    UserId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password=db.Column(db.String(100),nullable=False,unique=True)
    email = db.Column(db.String(100), nullable=False)
    CreateAt = db.Column(db.DateTime, nullable=False)

@app.route('/',methods=['POST','GET'])
def index(consoleInfo=""):
    db.create_all()
    return render_template("index.html",title="User input",consoleInfo=consoleInfo)

@app.route('/submit',methods=['POST'])
def submit():
  username=request.form['username']
  password_hash=hash_password(request.form['password'])
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


    