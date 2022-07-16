if [ -f .env ]; then
    export $(xargs < .env)
fi

pip install --upgrade 'algoliasearch>=2.0,<3.0'
python clear_index.py

docker run -i --env-file=.env -e "CONFIG=$(cat config.json | jq -r tostring)" algolia/docsearch-scraper