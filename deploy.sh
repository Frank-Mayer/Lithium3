#!/bin/zsh
git fetch
cp -r app/ ../Lithium3-Public/
firebase deploy
cd ../Lithium3-Public/
git fetch
git update
git add *
git commit
git push
