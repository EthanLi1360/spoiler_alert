import datetime
class FoodItem:

    def __init__(self, name: str, exp_days: int, category: str):
        # self.food_id = search through the food item list for the one with the same name
        self.name = name
        self.exp_days = exp_days
        self.category = category
        self._createdAt = datetime.datetime.now()

    def get_exp_days(self):
        return self.exp_days

    def set_exp_days(self, exp_days):
        self.exp_days = exp_days

    def get_category(self):
        return self.category

    def set_category(self, category: str):
        self.category = category

    # Returns how many days are left to prepare something with the specific product
    def get_time_remaining(self):
        time_left = self._createdAt - datetime.datetime.now() + datetime.timedelta(days=self.exp_days)
        return time_left.days
