def logMisunderstanding(user: int, scenario: int, prevMsg: str, prevRes: str):
    with open('./logs.txt', 'a', encoding="utf-8") as f:
        logStr = '\n'.join([f'user: {user} | scenario: {scenario} | msg: {prevMsg} | res: {prevRes}','---\n'])
        print(logStr)
        f.write(logStr)