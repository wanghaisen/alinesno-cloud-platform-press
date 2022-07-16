if [ -f .env ]; then
    export $(xargs < .env)
fi

pip install --upgrade 'algoliasearch>=2.0,<3.0'
python clear_index.py

docker run \
    -e APPLICATION_ID=$(printenv ALGOLIA_APPLICATION_ID) \
    -e API_KEY=$(printenv ALGOLIA_WRITE_API_KEY) \
    -e CONFIG="$(cat config.json | jq '.start_urls=[env.ALGOLIA_SITE_URL]' | jq '.index_name=env.ALGOLIA_INDEX_NAME' | jq -r tostring)" \
    algolia/docsearch-scraper:v1.13.0