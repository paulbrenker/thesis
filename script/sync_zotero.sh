#!/bin/bash

BIB_FILE="tex/references.bib"

if [ -f "$BIB_FILE" ]
then
  curl --request GET \
    --url 'https://api.zotero.org/groups/5408323/items?v=3&format=biblatex&limit=100' \
    --header "Zotero-API-Key: $ZOTERO_TOKEN" \
    --output $BIB_FILE
else
    echo "Error: The file $BIB_FILE does not exist."
fi