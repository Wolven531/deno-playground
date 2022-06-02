# deno-playground

## Available Scripts

Inside the `scripts` directory are a series of scripts (supporting PowerShell and Bash)

* `run-tests.ps1` - Runs unit tests using PowerShell (Windows)
* `run-tests.sh` - Runs unit tests using bash (Linux, Mac)
* `run.ps1` - Runs Deno server using PowerShell (Windows)
* `run.sh` - Runs Deno server using bash (Linux, Mac)

## Misc.

To connect to the MongoDB instance, you will need the following

* a local MongoDB CLI, such as [Win MongoSh 1.4.2](https://downloads.mongodb.com/compass/mongosh-1.4.2-win32-x64.zip)
* a username and password, provisioned by admin [wolven531](https://github.com/wolven531)
* your machine IP whitelisted by admin [wolven531](https://github.com/wolven531)
* Connection details
	* mongodb version = `5.0.8`
	* cluster = `thefirstcluster`
	* database name = `deno-db`
