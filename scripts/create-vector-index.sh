#!/bin/bash

gcloud firestore indexes composite create \
  --collection-group=user-summaries \
  --query-scope=COLLECTION \
  --field-config field-path=embedding,vector-config='{"dimension":"1536", "flat": "{}"}' \
  --database="(default)"