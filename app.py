from flask import Flask, render_template, url_for,request
from Models import *
# config is the python file used to store credentials.

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
with app.app_context():
    db.create_all()

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

@app.route('/',methods=['POST','GET'])
def index(consoleInfo=""):
    return render_template("signup.html",title="User input",consoleInfo=consoleInfo)

@app.route('/submit',methods=['POST'])
def submit():
  username=request.form['username']
  password_hash=hash_password(request.form['password'])
  email=request.form['email']
  new_user = User(username=username,password_hash=password_hash,email=email)
  try:
    db.session.add(new_user)
    db.session.commit() 
    return render_template("signup.html",title="User input",consoleInfo="last input is successful")
  except:
     print(f"Either {username} is used or the value entered is illegal.")
     return render_template("signup.html",title="User input",consoleInfo="last input is not successful")

if __name__=="__main__":
  app.run(debug=True)


    