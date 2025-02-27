import requests

def get_player_data(player_name, api_key='8a7d423689495684d0356c33903fd487'):
    regions = ['asia', 'eu', 'na', 'ru']
    base_url = 'https://api.worldofwarships.{region}/wows/account/list/'
    
    for region in regions:
        url = base_url.format(region=region)
        params = {
            'application_id': api_key,
            'search': player_name,
            'type': 'exact'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') == 'ok' and data.get('data'):
                return {"region": region, "data": data['data']}
        except requests.exceptions.RequestException as e:
            print(f"Error in {region}: {e}")
    
    return {'error': 'Player not found in any region'}

# Example usage
if __name__ == "__main__":
    player_name = input("Enter player name: ")
    result = get_player_data(player_name)
    print(result)