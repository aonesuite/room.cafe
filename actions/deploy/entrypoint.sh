#!/bin/bash

set -e

if [[ -z "$GITHUB_WORKSPACE" ]]; then
  echo "Set the GITHUB_WORKSPACE env variable."
  exit 1
fi

binary_dir="$GITHUB_WORKSPACE/.release"

ls $binary_dir