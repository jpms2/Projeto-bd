set mypath=%cd%
title Running MongoDB Database
cd C:\Program Files\MongoDB\Server\3.4\bin
mongod --dbpath %mypath%\data\
