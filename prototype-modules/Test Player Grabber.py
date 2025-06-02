import requests

"""
PLAYER API LINKS
"""
#https://api.wotblitz.eu/wotb/account/list/?application_id=8a7d423689495684d0356c33903fd487 Players
#https://api.wotblitz.eu/wotb/account/info/?application_id=8a7d423689495684d0356c33903fd487 Players personal data
#https://api.wotblitz.eu/wotb/account/info/?application_id=8a7d423689495684d0356c33903fd487 Players achivements
#https://api.wotblitz.eu/wotb/account/tankstats/?application_id=8a7d423689495684d0356c33903fd487 Last battle

API_KEY = "8a7d423689495684d0356c33903fd487"
BASE_URL = "https://api.wotblitz."
REALMS = ["asia", "eu", "com"]  # 'com' = NA

def player_retrieve(name, exact):
    response_list = []

    params = {
        'application_id': API_KEY,
        'search': str(name)
    }

    if exact:
        params["type"] = "exact"

    for server in REALMS:
        response = requests.get(BASE_URL + server + "/wotb/account/list/", params=params)
        response_list.append(response)

    return response_list


if __name__ == "__main__":
    response_dict = {
        "asia_response": "",
        "eu_response": "",
        "na_response": ""
    }

    realm_keys = list(response_dict.keys())
    response_list = player_retrieve("yang_me", True)

    for i, response in enumerate(response_list):
        realm = realm_keys[i].split("_")[0]  # extract realm from key

        if response.status_code == 200:
            data = response.json().get('data', [])
            if data:
                player = data[0]
                response_dict[realm_keys[i]] = {
                    "nickname": player.get("nickname"),
                    "account_id": player.get("account_id")
                }
                print(f" Player '{player['nickname']}' found on {realm.upper()} server. ID: {player['account_id']}")
            else:
                response_dict[realm_keys[i]] = "No player found"
                print(f" Player not found on {realm.upper()} server.")
        else:
            response_dict[realm_keys[i]] = "Request failed"
            print(f"⚠️ Request failed on {realm.upper()} server.")

    print("\nFinal Response Dictionary:")
    print(response_dict)
