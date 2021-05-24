# Install the papiNet API Mock Service

## Create a Virtual Machine (VM)

1\. Create a Virtual Machine with a public IP address, as well as with HTTP (80) and HTTPS (443) traffic allowed.

## Domain Name

1\. Create an DNS `A Record` with name `papinet.papinet.io` and the public IP address from above.
2\. Create an DNS `A Record` with name `papinet.pulp.papinet.io` and the public IP address from above.
3\. Create an DNS `A Record` with name `papinet.fast.papinet.io` and the public IP address from above.
4\. Create an DNS `A Record` with name `papinet.road.papinet.io` and the public IP address from above.
5\. Create an DNS `A Record` with name `papinet.corp.papinet.io` and the public IP address from above.

## Install NGINX

1\. Download and install NGINX:

```text
$ sudo apt-get update
$ sudo apt-get install -y nginx
```

2\. Test the installation by opening <http://papinet.papinet.io> in a browser.

## Install Node.js

1\. Download and install Node.js:

```text
~$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
~$ sudo apt-get install -y nodejs
```

2\. Check the installation:

```text
~$ node --version
v12.18.0
~$ npm --version
6.14.11
```

## Install and Run the papiNet API Mock Service

1\. Create a `papinet-mock-service-1-1-0` folder:

```text
$ mkdir papinet-mock-service-1-1-0
$ cd papinet-mock-service-1-1-0/
```

2\. Upload the needed files into the `papinet-mock-service-1-1-0` folder using the `upload.cmd` windows command script.

3\. Install the dependencies by typing the following command:

```text
~$ npm install
```

5\. Install the PM2 daemon process manager (that will help you manage and keep your application online 24/7):

```text
~$ sudo npm install pm2@latest -g
```

6\. Start the papiNet mock service with PM2:

```text
~$ pm2 start app.js --name papinet-mock-service-1-1-0
```

7\. Check locally if the papiNet mock service is properly running:

```text
~$ curl localhost:3002/orders
...
```

## Configure NGINX

1\. Upload the file `papinet.papinet.io` into the `papinet-mock-service-2021-01-16` folder.

2\. Configure NGINX by typing the following commands:

```text
~$ ls /etc/nginx/sites-available
~$ ls /etc/nginx/sites-enabled
~$ sudo rm /etc/nginx/sites-enabled/default
~$ cd ~/papinet-mock-service-1-1-0/nginx/
~$ sudo mv *.conf /etc/nginx/sites-available
~$ sudo ln -s /etc/nginx/sites-available/papinet.papinet.io.conf /etc/nginx/sites-enabled/papinet.papinet.io.conf
~$ sudo ln -s /etc/nginx/sites-available/papinet.road.papinet.io.conf /etc/nginx/sites-enabled/papinet.road.papinet.io.conf
~$ sudo ln -s /etc/nginx/sites-available/papinet.fast.papinet.io.conf /etc/nginx/sites-enabled/papinet.fast.papinet.io.conf
~$ sudo ln -s /etc/nginx/sites-available/papinet.pulp.papinet.io.conf /etc/nginx/sites-enabled/papinet.pulp.papinet.io.conf
~$ sudo service nginx configtest
~$ sudo service nginx reload
~$ sudo service nginx status
```

3\. Test the installation by opening <http://papinet.papinet.io/orders> in a browser.

## Use _Let’s Encrypt_ to configure HTTPS

1\. Let's update the NGINX configuration by typing the following commands:

```text
~$ sudo apt-get update
~$ sudo apt-get install certbot
~$ sudo certbot --nginx
```

2\. Test the installation by opening <https://papinet.papinet.io/orders> in a browser.
