class UserConversationStorage:
    
    def __init__(self) -> None:
        self.users: dict[int, int] = {}

    def setScenario(self, user, scenario):
        self.users[user] = scenario

    def clearUser(self, user):
        if user in self.users:
            self.users.pop(user)

    def getScenarioFor(self, user):
        if user not in self.users:
            return None
        
        return self.users[user]