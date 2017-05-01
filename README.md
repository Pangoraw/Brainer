# Brainer

Brainer is tool that can actually be used as a textbook. You can write in everything you want to. It will be saved and it is easily readable.

First of all, make sure you run the `npm install .` command in the Brainer folder to download all the dependencies of the program.

To be used as it is, you must run the app.coffee file. Using the command `coffee app.coffee`, make sure you have coffeescript installed globally. To store all the data, you must run a MongoDB database.

All setup of Brainer can be made in /config.cson
Example :
```
server :
  host : "192.168.0.1"
  port : "80"
```

All properties are not required, you can, for example, only change the port of the server. In this case, it will use default values that you can find in `config/index.coffee`
