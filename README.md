# JURRI

## Prerequisites
This application is based on Python scripts so the Python should be installed on your machine.

The application uses the following python packages, which should also be installed. For example using `pip`.
- [Jinja2](https://palletsprojects.com/projects/jinja/) 
- [python-dotenv](https://pypi.org/project/python-dotenv/)
- [paramiko](https://www.paramiko.org/)

## How to test
### Step 1 - Building
You can build the webpage by runnig the following script:

```sh
python ./build.py
```

This will create a web page and place the generated source code in the `build` folder.

### Step 2 - Running the server
You can start the server with the following command:

```sh
python -m http.server -d build
```

Now you should be able to access the webpage from [localhost:8080](http://localhost:8000/).

## How to upload the webpage to the server
### Step 1 - Turn on the VPN
Instructions can be found [here](https://www.tuni.fi/en/it-services/handbook/networks/remote-access-and-vpn#eduvpn).

### Step 2 - Create .env file
The .env file should contain the hostname of the website server. For example:
```
HOSTNAME=the.host.fi
```

### Step 3 - Run the dist script 
```sh
python ./dist.py
```

The script asks for your university username and password.

> [!NOTE]  
> To connect to the server, permission must be obtained from the university first. [See](https://intra.tuni.fi/en/it-services/computers/linux-instructions/webpages-tuni-fi-service)
