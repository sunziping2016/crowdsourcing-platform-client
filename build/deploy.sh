#!/usr/bin/env sh

current_dir=$(dirname "$0")
targets="../../crowdsourcing-platform-server/public szp15.cn:/srv/http/crowdsourcing/public"

pushd "$current_dir"
for target in $targets; do
  rsync --delete -avh "../dist/" --exclude="service-worker.js" --exclude="admin" $target
  rsync --avh "../dist/service-worker.js" $target
done
popd
