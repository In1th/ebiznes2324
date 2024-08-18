import os

import discord as dc
from dotenv import load_dotenv
from discord.ext import commands
import pinecone
from sentence_transformers import SentenceTransformer

from userConvoStorage import UserConversationStorage
from event import EventStorage
from logMisunderstanding import logMisunderstanding
from eventsDb import EventsDb

load_dotenv()
TOKEN = os.getenv('TOKEN')

intents = dc.Intents.default()
intents.message_content = True
intents.dm_messages = True

client = dc.Client(intents=intents)
bot = commands.Bot(command_prefix='$', intents=intents)

users = UserConversationStorage()
events = EventStorage()
prevMsg: dict[int, tuple[int, str, str]] = {}
# db = EventsDb()

pinecone.init(api_key=os.getenv("PINECONE"), environment="gcp-starter")
index = pinecone.Index("responses")
model = SentenceTransformer('intfloat/e5-small-v2')

def getEmbedding(text):
    return model.encode(text, normalize_embeddings=True).tolist()

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

def handle(event, content, id):
  event.handleEvent(content)
  msg = event.getNextMsg()
  if event.isEnd():
     events.clearEvent(id)
  return msg

def welcomeMsg(name):
   return f"""Hi **{name}**! I'm your friendly event organizer bot, please tell me what you want to do.
**Remember**: if I miunderstand you, please tell me that's not what you meant."""

@client.event
async def on_message(message: dc.Message):
    if message.channel.type == dc.ChannelType.private and not message.author.bot:
        scenario = users.getScenarioFor(message.author.id)
        if scenario is None:
            await message.channel.send(welcomeMsg(message.author.name))
            users.setScenario(message.author.id, 0)
            return
        
        query = index.query(
              vector=getEmbedding(message.content),
              top_k=1,
              include_metadata=True
        )
        print(query)
        msg = query['matches'][0]['metadata']['response']
        newScenario = query['matches'][0]['metadata']['scenario']
        event = events.getEventFor(message.author.id)
        
        # reset if misunderstood
        if newScenario == 4:
          users.setScenario(message.author.id, 0)
          events.clearEvent(message.author.id)
          prev = prevMsg[message.author.id]
          logMisunderstanding(message.author.id, prev[0], prev[1], prev[2])
          newScenario = 0

        elif newScenario != 0 and event is None:
          users.setScenario(message.author.id, newScenario)
          ev = events.getEvent(message.author.id, newScenario)

          if ev is not None and ev.isNow():
             msg = handle(ev, message.content, message.author.id)
          else:
            events.setEvent(message.author.id, ev)     

        if event is not None:
          print('event')
          msg = handle(event, message.content, message.author.id)
        
        prevMsg[message.author.id] = (users.getScenarioFor(message.author.id), message.content, msg)

        await message.channel.send(msg)
        

client.run(TOKEN)