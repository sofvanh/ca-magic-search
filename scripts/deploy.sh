#!/bin/bash
gcloud run deploy ca-magic-search \
  --source . \
  --region europe-west1 \
  --env-vars-file .env.yaml \
  --allow-unauthenticated