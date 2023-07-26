#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
. ~/.nvm/nvm.sh
sudo nvm install node

#create our working directory if it doesnt exist
DIR="/home/ubuntu/nest-app"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi