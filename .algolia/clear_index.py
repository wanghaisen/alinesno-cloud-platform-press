# clear_index_algolia.py
from algoliasearch.search_client import SearchClient
import os

APPLICATION_ID = os.environ.get('ALGOLIA_APPLICATION_ID')
API_KEY = os.environ.get('ALGOLIA_WRITE_API_KEY')
INDEX_NAME = os.environ.get('ALGOLIA_INDEX_NAME')

print('applicationid = ' + APPLICATION_ID)
print('api_key = ' + API_KEY)
print('index_name = ' + INDEX_NAME)

# Connect and authenticate with your Algolia app
client = SearchClient.create(APPLICATION_ID , API_KEY)

index = client.init_index(INDEX_NAME)
index.clear_objects()

print('clear index success!')