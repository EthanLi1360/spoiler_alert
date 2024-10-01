import datetime
import uuid


class User:
    def __init__(self, username: str, password_hash: str, email: str):
        self.createdAt = datetime.datetime.now()
        self.username = username
        self.password_hash = password_hash
        self.email = email
        # UUID object, we can use strings if this is easier
        self.id = uuid.uuid4().hex
        self.fridge_ids = []

    def get_username(self) -> str:
        return self.username

    def get_email(self) -> str:
        return self.email

    def get_id(self) -> uuid:
        return self.id

    def get_time_created(self) -> datetime:
        return self.createdAt

    def set_username(self, username: str):
        self.username = username

    def set_email(self, email: str):
        self.email = email

    # Assumes that the password is hashed
    def set_password(self, password: str):
        self.password_hash = password

    def create_fridge(self, new: bool, name: str) -> bool:
        if new:
            # Create the fridge object
            # self.fridge_ids.append(fridge.get_id)
            # set fridge to allow this user to use that fridge
            # return True
            return False
        # if name in (whatever dataset we will be using to store names):
        # get the appropriate fridge
        #   self.fridge_ids.append()
        # set fridge to allow this user to use that fridge
        #   return True
        return False
