#!/bin/bash

#download node and npm
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
sudo . ~/.nvm/nvm.sh
sudo nvm install 16

#create our working directory if it doesnt exist
DIR="/home/ec2-user/nest-app"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  sudo mkdir ${DIR}
fi