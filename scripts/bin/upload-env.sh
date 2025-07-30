#!/bin/bash

PROJECT_NAME="laxmanko-akshar"
ENV="preview"

while IFS='=' read -r name value
do
  if [[ $name != \#* && $name == *[![:space:]]* ]]; then
    echo "Setting $name"
    npx wrangler pages project set --project-name="$PROJECT_NAME" --env="$ENV" --var-name="$name" --value="$value"
  fi
done < .env.local
