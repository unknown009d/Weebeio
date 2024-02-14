import random, json, time, re
from warnings import catch_warnings
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer, ListTrainer
from sqlalchemy import false

botName = "Weebeio"
secSaveCode = "druba123"

bot = ChatBot(botName,
              read_only=True,
              preprocessors=['chatterbot.preprocessors.clean_whitespace'],
              storage_adapter='chatterbot.storage.SQLStorageAdapter',
              database_uri='sqlite:///db.sqlite3',
              logic_adapters=[{
                  'import_path': 'chatterbot.logic.BestMatch',
                  'default_response': "drb_cant",
                  'maximum_similarity_threshold': 0.90
              }, 'chatterbot.logic.MathematicalEvaluation'])



def checkBlanks(myString):
    if myString and myString.strip():
        return False
    return True


def cleanMessage(msg):
    cleanMsg = re.sub(r'[.,"\'-?:!;]', '', msg)
    cleanMsg = cleanMsg.lower()
    return cleanMsg


chatBot = Flask(__name__)
cors = CORS(chatBot, resources={r"/*": {"origins": "*"}})

# Get the Response from the ChatterBot
def getResponse(user_input):
    bot_response = bot.get_response(user_input)
    if not user_input or checkBlanks(user_input):
        return "Bot : Could you write something for me to response -_-"
    retVal = {"message": str(bot_response)}
    return retVal

def findNameKeyword(set_botName, userMessage, cleanMsg):
    breakCleanMsg = cleanMsg.split(" ")
    matchCaseforName = 0
    for data in set_botName:
        for inD in breakCleanMsg:
            if inD == data:
                matchCaseforName += 1

    matchCaseforSMname = 0
    for data in breakCleanMsg:
        for inD in ["your", "name", "ur"]:
            if inD == data:
                matchCaseforSMname += 1

    if userMessage[-1:] == "?":
        matchCaseforSMname += 1

    if (matchCaseforName >= 3 or matchCaseforSMname >= 3):
        return True
    else:
        return False

@chatBot.route("/")
def index():
    return "<h1>ChatBot Server</h1>"

@chatBot.route('/api/response', methods=['POST'])
def respo():
    userMessage = (request.json)['newMessage']
    cleanMsg = cleanMessage(userMessage)
    set_botName = ["your", "name", "ur", "what", "whats"]
    diffResponse = [
        "is what my developers called me :)", "＼(◦'⌣'◦)／",
        "is my name. ＼(^o^)／", "your personal bot",
        "your friendly neighborhood bot.",
        ". I know that's really weird, but i love it.",
        "is what you can call me"
    ]

    diffR_botName = botName + " " + diffResponse[random.randint(
        0,
        len(diffResponse) - 1)]

    findKeywordN = False
    for msgD in cleanMsg.split(" "):
        if msgD == "name":
            findKeywordN = findNameKeyword(set_botName, userMessage, cleanMsg)
            break
    if (findKeywordN == True):
        return jsonify({"message": diffR_botName})

    return jsonify(getResponse(userMessage))


@chatBot.route('/api/wrongWords', methods=['POST'])
def wrongWords():
    userMessage = (request.json)['sentence']
    cleanMsg = cleanMessage(userMessage)
    data = json.load(open("data_feed/words_dictionary.json", 'r'))
    gotValue = False
    
    """ 
    NOTE : This is for checking all the words in that message 
    --------------------------------------------------------- 
    for word in cleanMsg.split(" "):
         for val in data.keys():
             if val == word:
                 gotValue = True
                 break
             else:
                 gotValue = False
         if gotValue == False:
             break; 
    """
    
    for val in data.keys():
        if val == cleanMsg.split(" ")[0]:
            gotValue = True
            break


    return jsonify({"message": gotValue})

@chatBot.route('/api/trainBot', methods=['POST'])
def trainBot():
    returnData = (request.json)['conversation']
    success = False;
    try:
        # ListTrainer(bot).train(returnData.split(","))
        ListTrainer(bot).train(returnData)
        success = True
    except:
        success = False
    return jsonify({"message": success})


@chatBot.route('/api/securityCode', methods=['POST'])
def securityCode():
    sc = (request.json)['secCode']
    return jsonify({"message": (sc == secSaveCode)})
