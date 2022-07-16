if [ -f .env ]; then
    export $(xargs < .env)
fi

docker run \
    -e APPLICATION_ID=$(printenv ALGOLIA_APPLICATION_ID) \
    -e API_KEY=$(printenv ALGOLIA_WRITE_API_KEY) \
    -e "CONFIG=$(cat config.json | jq -r tostring)" \
    algolia/docsearch-scraper:v1.13.0