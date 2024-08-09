#!/bin/bash

packages=$(cat <<EOF
packages/uds/gitlab
packages/uds/gitlab-runner
packages/uds/sonarqube
packages/uds/postgres-operator
packages/uds/mattermost
packages/uds/jenkins
packages/uds/valkey
EOF
)

echo "$packages" | while read package; do
  repo="ghcr.io/defenseunicorns/$package"
  dir="ui/src/data/$package"
  mkdir -p "$dir"
  echo "$repo"
  versions=$(oras repo tags $repo)
  echo "$versions"
  latest=$(echo "$versions" | tail -n 1)
  echo "$repo:$latest"
  manifest=$(oras manifest fetch --platform=multi/amd64 "$repo:$latest")
  digest=$(echo $manifest | yq '.layers[] | select(.annotations["org.opencontainers.image.title"] == "zarf.yaml") | .digest')
  oras blob fetch --output - "$repo@$digest" | yq -o=json >> "$dir/zarf.json"
done
