import requests

API_KEY = "8a7d423689495684d0356c33903fd487"
BASE_URL = "https://api.wotblitz."
REALMS = ["asia", "eu", "com"]

"""
----- Player ID Retriver -----
"""

def player_searcher(nickname):

    data = search_request(nickname, type='exact')
    if data == {}:
        data = search_request(nickname, type='startswith')
    
    return data

def search_request(nickname, type):
    
    data = {}

    params = {
        "application_id" : API_KEY,
        'search' : nickname,
        'limit' : 100,
        'type' : type
    }

    for server in REALMS:
        
        response = requests.get(BASE_URL + server + "/wotb/account/list/", params=params)

        if response.status_code == 200:
            json_data = response.json()  # Parse JSON response into a dict

            data_list = json_data.get("data", []) #gets data otherwise returns []

            for player in data_list:
                name = player.get("nickname")
                id = player.get("account_id")
        
                player_dict = {
                    "name" : name,
                    "server" : server
                }

                data[id] = player_dict

    return data

"""
----- Player personal data -----
"""

def player_data(player_id, server, access_token=None):
    
    response = None
    stats = None

    params = {
        "application_id" : API_KEY,
        "account_id" : player_id
    }

    if access_token != None:
        params["access_token"] = access_token

    response = requests.get(BASE_URL + server + "/wotb/account/info/", params=params)
    
    json_data = response.json()
    data_dict = json_data.get("data", {})
    
    if data_dict:
        player_id, player_info = next(iter(data_dict.items()))

        # Get just the 'statistics' dict
        stats = player_info.get("statistics", {})

    return stats

if __name__ == "__main__":

    #Player Search

    name = "yang_me"

    search_data = player_searcher(name)  

    print(search_data)

    #Strucutre:
    """
    search_data -> dict
    - User ID (object) -> dict
        - Name
        - Server (e.g. asia)
    """

    #Selected account

    selected_account_id = "2025425481" #id for yang_me
    server = "asia"

    player_data_response = player_data(selected_account_id, server)

    print(player_data_response)

    #Structure:
    """
    player_data_response
    - clan
        - clan stat 1
        - clan stat 2
    - all (your stats)
        - all stat 1
        - all stat 2
    """