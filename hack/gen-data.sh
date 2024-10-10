#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

apps_dir="ui/static/api/apps"
packages_dir="ui/static/api/packages"

echo "Setting up directories..."
rm -rf "$apps_dir"
mkdir -p "$apps_dir"
mkdir -p "$packages_dir"
# Uncomment the following line if you want to clear the packages directory each run
# rm -rf "$packages_dir/*"

# Arrays to store successful and failed packages
successful_packages=()
failed_packages=()

# Check if a filename was provided as an argument
if [ $# -eq 1 ]; then
    files="apps/$1.yaml"
    if [ ! -f "$files" ]; then
        echo "Error: File $files does not exist."
        exit 1
    fi
else
    files=apps/*.yaml
fi

echo "Processing file(s): $files"

for file in $files; do
  echo "Processing file: $file"

  export PACKAGE=$(basename -s ".yaml" "$file")
  echo "Package: $PACKAGE"

  export REPO="ghcr.io/defenseunicorns/packages/uds/$PACKAGE"
  echo "Repository: $REPO"

  # Flag to track if this package was processed successfully
  package_success=true

  echo "Fetching versions..."
  export VERSIONS=$(oras repo tags "$REPO" | grep "upstream" || true)
  if [ -z "$VERSIONS" ]; then
    echo "Warning: No upstream versions found for $REPO"
    package_success=false
    failed_packages+=("$PACKAGE")
    continue
  fi

  latest=$(echo "$VERSIONS" | tail -n 1)
  echo "Latest version: $REPO:$latest"

  echo "Fetching architectures..."
  export ARCHS=$(oras manifest fetch "$REPO:$latest" | yq '.manifests[].platform.architecture' || echo "")
  if [ -z "$ARCHS" ]; then
    echo "Warning: No architectures found for $REPO:$latest"
    package_success=false
    failed_packages+=("$PACKAGE")
    continue
  fi
  echo "Architectures: $ARCHS"

  echo "Generating JSON for $PACKAGE..."
  yq '
    .spec.versions = (env(VERSIONS) | split(" ") | reverse) |
    .spec.architecture = (env(ARCHS) | split(" ") | sort) |
    .spec.repository = .spec.repository // env(REPO) |
    .spec.security.fips = .spec.security.fips // false |
    .spec.security.cveReport = .spec.security.cveReport // false |
    .spec.security.sbom = .spec.security.sbom // true |
    .spec.security.nist80053 = .spec.security.nist80053 // false |
    .spec.security.impactLevel = .spec.security.impactLevel // [] |
    .spec.contractingDetails.vehicle = .spec.contractingDetails.vehicle // ["Available"] |
    .spec.vendor = .spec.vendor // {"name": "Defense Unicorns", "url": "https://defenseunicorns.com/contactus"} |
    .spec.infrastructure = .spec.infrastructure // [] |
    .spec.categories = .spec.categories // []
  ' "$file" -o=json >"$apps_dir/$PACKAGE.json"

  echo "Fetching manifest for $REPO:$latest..."
  manifest=$(oras manifest fetch --platform=multi/amd64 "$REPO:$latest")

  echo "Extracting digest..."
  digest=$(echo "$manifest" | yq '.layers[] | select(.annotations["org.opencontainers.image.title"] == "zarf.yaml") | .digest')
  if [ -z "$digest" ]; then
    echo "Warning: No digest found for zarf.yaml in $REPO:$latest"
    package_success=false
    failed_packages+=("$PACKAGE")
    continue
  fi

  echo "Fetching blob and generating JSON..."
  oras blob fetch --output - "$REPO@$digest" | yq -o=json >"$packages_dir/$PACKAGE.json"

  if [ ! -f "$packages_dir/$PACKAGE.json" ]; then
    echo "Error: Failed to create $packages_dir/$PACKAGE.json"
    package_success=false
    failed_packages+=("$PACKAGE")
  else
    echo "Successfully created $packages_dir/$PACKAGE.json"
    if [ "$package_success" = true ]; then
      successful_packages+=("$PACKAGE")
    fi
  fi

done

echo "Generating index.json..."
yq eval-all -o=json '. as $item ireduce ([]; . + $item)' "$apps_dir"/*.json >"$apps_dir/index.json"

echo "Script completed."

# Summary
echo "----------------------------------------"
echo "Summary of Package Processing"
echo "----------------------------------------"
echo "Total packages processed: $((${#successful_packages[@]} + ${#failed_packages[@]}))"
echo "Successful packages: ${#successful_packages[@]}"
echo "Failed packages: ${#failed_packages[@]}"

if [ ${#successful_packages[@]} -gt 0 ]; then
  echo "Successful packages:"
  for package in "${successful_packages[@]}"; do
    echo "  - $package"
  done
fi

if [ ${#failed_packages[@]} -gt 0 ]; then
  echo "Failed packages:"
  for package in "${failed_packages[@]}"; do
    echo "  - $package"
  done
fi
