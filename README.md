## Steps to setup custom Administrative Interface

## Install and Start MongoDB
To install MongoDB on an Ubuntu based system type:
```sh
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Initialize the Database
1. Change directories to the labs/admin-interface/initialize
   ```sh
   cd ~/labs/admin-interface/initialize
   ```
2. Install the dependencies for the database initialize script
    ```sh
    npm install
    ```
3. Run the initialize script
   ```sh 
   node initialize.js
   ```
   **Note: that you will need to press Ctrl-C to exit the initialize script**


## Installation
1. Open a ssh terminal to your NUC  
2. Clone this project with command: git clone https://github.com/SSG-DRD-IOT/admin-interface  
3. On the command prompt run the following commands  
   `cd admin-interface`  
   `npm install`  
4. Go to app folder and run  
   `npm install -g bower`
   `bower install`  
   You can select Answer '1' in all the options  
5. Once all bower dependencies are installed, come back to admin-interface folder and type:  
   `node server.js` 
4. Your http server is now running and listening on port 5000  
5. Go to your browser and type: http://gateway-IP:5000  
