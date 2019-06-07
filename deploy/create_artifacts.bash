#!/bin/bash
base_path='./'
types_path="${base_path}packages/types/"
web_path="${base_path}packages/web/"
web_api_path="${base_path}packages/web-api/"

# rm -rf ${base_path}.git

# rm -rf $types_path
# rm -rf "${web_path}src"
# rm -rf "${web_path}public"
# rm -rf "${web_path}node_modules"
# rm "${web_path}.gitignore"
# rm "${web_path}README.md"
# rm "${web_path}tsconfig.json"

# rm -rf "${web_api_path}src"
# rm -rf "${web_api_path}.vscode"
# rm "${web_api_path}.gitignore"
# rm "${web_api_path}README.md"
# rm "${web_api_path}tsconfig.json"
# rm "${web_api_path}.env.sample"
# rm "${web_api_path}nodemon.json"
dt=`date '+%d-%m-%Y-%H_%M_%S'`

base=$(basename $PWD)
cd ..
tar -czf "artifact-$dt.tar.gz" $base
mv "artifact-$dt.tar.gz" $base
