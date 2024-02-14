import json

data = json.load(open("data/words_dictionary.json", 'r'))

def check(word):
    for val in data.keys():
        if val.lower() == word.lower():
            return True
    return False

while True:
    word = input("Enter word : ")
    fndWd = True;

    for dt in word.split(" "):
        if check(dt) == False:
            fndWd = False
            break
    
    if fndWd:
        print("Found")
    else:
        print("Not Found!")

    # if check(word) == True:
    #     print("Found")
    # else:
    #     print("Not Found")
