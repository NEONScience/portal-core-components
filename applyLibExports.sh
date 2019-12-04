#!/bin/bash

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

echo "Fixing index.js exports..."

if [ "$machine" == "Mac" ]; then
    gsed --in-place --regexp-extended 's/exports.(\w*) = _(\w*).\w*;/exports.\1 = _\2.default;/g' ./lib/index.js
else
    sed -i 's/exports\.\(\w*\) = _\(\w*\)\.\w*;/exports\.\1 = _\2.default;/g' ./lib/index.js
fi

echo "Done."
