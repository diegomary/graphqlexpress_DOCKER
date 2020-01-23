#!/bin/bash
rm -rf ./core;
mkdir core;
cd ../client && npm run build;
cd ..;
cd docker;
cp ../server/. -r  ./core
rm -rf ./core/node_modules
rm -rf ./core/react;
cp ../client/build/. -r ./core/react
#docker build -t authschema .
