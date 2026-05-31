# JURRI

## Prerequisites
This application is based on Python scripts. Install [uv](https://docs.astral.sh/uv/) to manage dependencies and run the scripts:

```sh
uv sync
```

This installs all required packages automatically.

## How to Develop

### Watch Mode

The easiest way to work on the project is to run the watch script. It rebuilds automatically whenever a file changes and serves the result locally:

```sh
uv run watch.py
```

The page is then available at [localhost:8000](http://localhost:8000/). The watcher picks up changes in `templates/`, `static/`, and `treeniajat.txt`.

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
uv run dist.py
```

The script asks for your university username and password.

> [!NOTE]  
> To connect to the server, permission must be obtained from the university first. [See](https://intra.tuni.fi/en/it-services/computers/linux-instructions/webpages-tuni-fi-service)
