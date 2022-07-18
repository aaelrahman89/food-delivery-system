#!/bin/bash

set -e

function _log() {
  echo "[lint-staged] $1"
}

_log "linting staged files.."
FILES=$(git diff --cached --name-only --diff-filter=ACMR "*.js" "*.vue" "*.ts" | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

_log "running eslint --fix"
# Prettify all selected files
echo "$FILES" | xargs ./node_modules/.bin/eslint --fix

_log "adding linted files back"
# Add back the modified/prettified files to staging
echo "$FILES" | xargs git add

exit 0
