Application entrypoint: `./index.js`  

### How to run

#### localy

Make sure service configuration is valid for your environment in config/config.js  
You will need to set environment variable defined on top of the config file.  

Then you can start the service

> npm start

#### in docker

> docker-compose up

Run `docker container ls` to see through which ports you can access services, running inside the cointainer, on the host.

#### in docker (development mode)

* Download [serviser-docker](https://raw.githubusercontent.com/lucid-services/serviser-tools/master/serviser-docker.sh) helper script and place it in your `$PATH`.  
* Execute `serviser-docker` in the project root  
* You will be dropped into bash of ephemeral container (the container will self destruct uppon exiting the tty)  
* In there you can run:  

```bash
> npm run migrate
> npm run test:int
> npm start
```
* Project files are mirrored (mounted) into the containers fs (except `node_modules` directory) so you can edit them on your host environment.  


### Tests

> npm test
