import sqlite3
import uuid

class EventsDb:
    con = sqlite3.connect("events.db")
    cur = con.cursor()

    def __init__(self) -> None:
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS events(
                eventId varchar(36) NOT NULL PRIMARY KEY,
                user int,
                name varchar(255),
                description varchar(255),
                date varchar(255)
        );""")

    def addEvent(self, user, name, description, date):
        id = uuid.uuid4()
        self.cur.executemany('INSERT INTO events VALUES (?,?,?,?,?)', [(str(id), user, name, description, date)])
        self.con.commit()
        return id
    
    def dateBooked(self, date):
        res = self.cur.execute(f'SELECT * FROM events WHERE date IS "{date}"')
        data = res.fetchall()
        return len(data) > 0
    
    def fetchEvents(self):
        res = self.cur.execute("SELECT * FROM events WHERE DATE(substr(date,7,4)||'-'||substr(date,4,2)||'-'||substr(date,1,2)) >= DATE() ORDER BY date LIMIT 10;")
        data = res.fetchall()
        return data
    
    def getById(self, id):
        res = self.cur.execute(f'SELECT * FROM events WHERE eventId IS "{id}";')
        data = res.fetchall()
        return data[0]
    
    def deleteById(self, id):
        self.cur.execute(f'DELETE FROM events WHERE eventId IS "{id}";')
        self.con.commit()