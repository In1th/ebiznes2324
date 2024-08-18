from abc import ABC, abstractmethod

from eventsDb import EventsDb 
import re
from datetime import datetime

class Event(ABC):

    @abstractmethod
    def handleEvent(self, msg: str): 
        pass

    @abstractmethod
    def getNextMsg(self) -> str: 
        pass

    @abstractmethod
    def isEnd(self) -> bool: 
        pass

    @abstractmethod
    def isNow(self) -> bool:
        pass

class EventStorage:

    def __init__(self) -> None:
        self.events: dict[int, Event] = {}

    def setEvent(self, user: int, ev: Event):
        self.events[user] = ev
    
    def getEvent(self, user: int, scenario: int) -> Event:
        if scenario == 1:
            return CreateEvent(user)
        elif scenario == 2:
            return ListEvent()
        elif scenario == 3:
            return DeleteEvent(user)

    def clearEvent(self, user):
        if user in self.events:
            self.events.pop(user)

    def getEventFor(self, user):
        if user not in self.events:
            return None
        
        return self.events[user]

class CreateEvent(Event):
    
    def __init__(self, user) -> None:
        super().__init__()
        self.user=user
        self.actionCounter=1
        self.name=''
        self.description=''
        self.date=''
        self.id=''
        self.error=''
        self.db = EventsDb()

    def handleEvent(self, msg: str): 
        if self.actionCounter == 1:
            self.name = msg
        elif self.actionCounter == 2:
            self.description = msg
        elif self.actionCounter == 3:
            if re.match(r'^\d\d-\d\d-\d\d\d\d$', msg) is None:
                self.error='Please type the date in correct format (DD-MM-YYYY)'
                return
            if datetime.strptime(msg, '%d-%m-%Y') < datetime.now():
                self.error='You can\'t book an event in the past ;)'
                return
            if self.db.dateBooked(msg):
                self.error='This date is already booked'
                return
            self.date = msg
            self.id = self.db.addEvent(self.user, self.name, self.description, self.date)

        self.actionCounter += 1

    def getNextMsg(self) -> str: 
        if self.error != '':
            err = self.error
            self.error = ''
            return err
        
        if self.actionCounter == 2:
            return 'Please describe your event'
        elif self.actionCounter == 3:
            return 'Please tell me when this event will hold place (in format DD-MM-YYYY)'
        elif self.actionCounter == 4:
            return f'Alright! I\'m booking event:\n{eventFormatter(self.name, self.description, self.date)}\nThis event ID is {self.id}\nDo you need anything else?'
        
    def isEnd(self) -> bool: 
        return self.actionCounter == 4
    
    def isNow(self) -> bool:
        return False

class ListEvent(Event):
    def __init__(self) -> None:
        super().__init__()
        self.events = ''
        self.db = EventsDb()

    def handleEvent(self, msg: str): 
        self.events = self.db.fetchEvents()

    def getNextMsg(self) -> str: 
        return '\n'.join(['You have those events in the near future: ', '\n \n'.join(list(map(toEventStr, self.events))), 'Do you need anything else?'])
        
    def isEnd(self) -> bool: 
        return True
    
    def isNow(self) -> bool:
        return True

class DeleteEvent(Event):
    def __init__(self, user) -> None:
        super().__init__()
        self.user=user
        self.actionCounter = 1
        self.name = ''
        self.error=''
        self.db = EventsDb()

    def handleEvent(self, msg: str): 
        if self.actionCounter == 1:
            if re.match(r'^([0-9A-Fa-f]{8}[-]?[0-9A-Fa-f]{4}[-]?[0-9A-Fa-f]{4}[-]?[0-9A-Fa-f]{4}[-]?[0-9A-Fa-f]{12})$', msg) is None:
                self.error='Please type valid event ID'
                return
            eventRecord = self.db.getById(msg)
            if eventRecord[1] != self.user:
                self.error='You can\'t delete someone else\'s event'
                return
            self.name = eventRecord[2]
            self.db.deleteById(msg)
        self.actionCounter += 1

    def getNextMsg(self) -> str: 
        if self.error != '':
            err = self.error
            self.error = ''
            return err
        
        return f'Succesfully deleted event "{self.name}"!\nDo you need anything else?'

    def isEnd(self) -> bool: 
        return self.actionCounter == 2
    
    def isNow(self) -> bool:
        return False

def toEventStr(event):
    return f'{eventFormatter(event[2], event[3], event[4])}\nId: ({event[0]})'

def eventFormatter(name, description, date):
    return '\n'.join([f'🪪 {name}',f'📝 {description}',f'📆 at {date}'])
