#!/bin/bash

echo "Generating handbook stream indexes..."

generate_index () {

DIR=$1
TITLE=$2
TARGET=$3

echo "# $TITLE" > $TARGET
echo "" >> $TARGET

for f in $(ls docs/$DIR/*.md 2>/dev/null | xargs -n1 basename | sort)
do
  NAME=$(echo $f | sed 's/.md//' | tr '_' ' ')
  echo "- [$NAME](../$DIR/$f)" >> $TARGET
done

}

generate_index "program-intelligence-discipline" "Stream 10 — Program Intelligence Discipline" "docs/handbook/handbook_stream_10_index.md"

generate_index "program-intelligence-framework" "Stream 20 — Program Intelligence Framework" "docs/handbook/handbook_stream_20_index.md"

generate_index "signal-science" "Stream 40 — Execution Signal Science" "docs/handbook/handbook_stream_40_index.md"

generate_index "program-intelligence-demonstrations" "Stream 50 — Demonstrations" "docs/handbook/handbook_stream_50_index.md"

generate_index "program-intelligence-case-studies" "Stream 60 — Case Studies" "docs/handbook/handbook_stream_60_index.md"

generate_index "program-intelligence-commercialization" "Stream 30 — Commercialization" "docs/handbook/handbook_stream_30_index.md"

echo "Indexes generated."
