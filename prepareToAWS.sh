#!/bin/bash

set -e
git pull
npm i
wait

rm -rf .output

npm run build
wait

zip -r output.zip .output

scp -i ./7sales.pem output.zip ubuntu@ec2-16-171-20-166.eu-north-1.compute.amazonaws.com:/home/ubuntu/nuxt-7sales/
wait
echo "FIRST PART ON LOCAL MACHINE FINISHED!!!"

ssh -i ./7sales.pem -tt ubuntu@ec2-16-171-20-166.eu-north-1.compute.amazonaws.com << 'EOF'

  source ~/.bashrc

  # ./buildFront.sh

  cd nuxt-7sales

  git pull

  npm i
  wait

  rm -rf .output

  unzip output.zip -d ./

  pm2 restart ecosystem.config.cjs

EOF

echo "DONE FRONT BUILDING"

