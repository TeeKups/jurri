import os
import paramiko
from dotenv import load_dotenv
from getpass import getpass

# Define the source and destination paths
BUILDPATH = "./build"
DESTINATIONPATH = "./jurri"

# Check if the source folder exists
if not os.path.exists(BUILDPATH):
    print("Build folder does not exist. Please run build.py first.")
    exit(1)

# Load environment variables from .env file
load_dotenv()

# Get the server address from environment variables
hostname = os.getenv("HOSTNAME")

if hostname == None:
    print("Please set the HOSTNAME environment variable into .env file")
    exit(1)

# Ask user for username and password
username = input("Enter your username: ")
password = getpass("Enter your password: ")

ssh = paramiko.SSHClient()
ssh.load_host_keys(os.path.expanduser(os.path.join("~", ".ssh", "known_hosts")))
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname, username=username, password=password)
sftp = ssh.open_sftp()

# Create the destination directory if it doesn't exist
try:
    sftp.stat(DESTINATIONPATH)
except FileNotFoundError:
    # Create the destination directory if it doesn't exist
    print(f"Creating directory {DESTINATIONPATH}")
    sftp.mkdir(DESTINATIONPATH)

# Reflect the directory structure in the destination directory
for root, dirs, _ in os.walk(BUILDPATH):
    for dir in dirs:
        local_dir = os.path.join(root, dir)
        remote_dir = os.path.join(
            DESTINATIONPATH, os.path.relpath(local_dir, BUILDPATH)
        )

        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            print(f"Creating directory {remote_dir}")
            sftp.mkdir(remote_dir)

# Upload the files from source directory to destination directory
for root, dirs, files in os.walk(BUILDPATH):
    for file in files:
        local_path = os.path.join(root, file)
        remote_path = os.path.join(
            DESTINATIONPATH, os.path.relpath(local_path, BUILDPATH)
        )
        print(f"Uploading {local_path} to {remote_path}")
        sftp.put(local_path, remotepath=remote_path)

sftp.close()
ssh.close()
