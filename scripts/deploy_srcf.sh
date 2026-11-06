#!/usr/bin/env bash
# Build the site and publish it to the SRCF mirror at https://gh464.user.srcf.net
#
# Only files tracked by git are built (as they are in the working tree), so local
# scratch folders never get published. Needs SSH key access to gh464@shell.srcf.net.
#
# Usage: scripts/deploy_srcf.sh [--dry-run]
set -euo pipefail

SRCF_HOST="${SRCF_HOST:-gh464@shell.srcf.net}"
SRCF_DIR="${SRCF_DIR:-public_html/}"
JEKYLL="${JEKYLL:-jekyll}"

repo="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

echo "Copying tracked files to $work/src"
mkdir -p "$work/src"
(cd "$repo" && git ls-files -z | rsync -a --from0 --files-from=- ./ "$work/src/")
cp "$repo/_config.srcf.yml" "$work/src/"

echo "Building"
(cd "$work/src" && JEKYLL_ENV=production $JEKYLL build \
  --config _config.yml,_config.srcf.yml --destination "$work/site")

git -C "$repo" rev-parse HEAD > "$work/site/.deploy-revision"

echo "Uploading to $SRCF_HOST:$SRCF_DIR"
rsync -az --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r "$@" "$work/site/" "$SRCF_HOST:$SRCF_DIR"

echo "Done: https://gh464.user.srcf.net/"
