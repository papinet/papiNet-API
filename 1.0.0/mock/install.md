# Install the papiNet API Mock Service

## Create a Virtual Machine (VM)

1\. Create a Virtual Machine with a public IP address, as well as with HTTP (80) and HTTPS (443) traffic allowed.

## Domain Name

1\. Create an DNS `A Record` with name `api.papinet.io` and the public IP address from above.

## Install NGINX

1\. Download and install NGINX:

```text
$ sudo apt-get update
$ sudo apt-get install -y nginx
```

2\. Test the installation by opening <http://api.papinet.io> in a browser.

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
6.14.4
```

## Install and Run the papiNet API Mock Service

1\. Create a `papinet-mock-service-2020-11-11` folder:

```text
$ $ mkdir papinet-mock-service-2020-11-11
$ cd papinet-mock-service-2020-11-11/
```

2\. Upload the following files into the `~` folder:

* `app.js`
* `package.json`
* `package-lock.json`
* `orders.json`
* `order.0e7dcf1d-f4f9-4f2f-af00-407bb20e5d92.json`

3\. Move those files to the `papinet-mock-service-2020-11-11` folder:

```text
$ mv app.js papinet-mock-service-2020-11-11/
$ mv package.json papinet-mock-service-2020-11-11/
$ mv package-lock.json papinet-mock-service-2020-11-11/
$ mv orders.json papinet-mock-service-2020-11-11/
$ mv order.0e7dcf1d-f4f9-4f2f-af00-407bb20e5d92.json papinet-mock-service-2020-11-11/
```

4\. Install the dependencies by typing the following command:

```text
~$ npm install
```

5\. Install the PM2 daemon process manager (that will help you manage and keep your application online 24/7):

```text
~$ sudo npm install pm2@latest -g
```

6\. Start the papiNet mock service with PM2:

```text
~$ pm2 start app.js
```

7\. Check locally if the papiNet mock service is properly running:

```text
~$ curl localhost:3001/orders
...
```

## Configure NGINX

1\. Upload the file `api.papinet.rest.conf` into the `~` folder.

2\. Configure NGINX by typing the following commands:

```text
~$ sudo mv api.papinet.io.conf /etc/nginx/sites-available
~$ sudo rm /etc/nginx/sites-enabled/default
~$ sudo ln -s /etc/nginx/sites-available/api.papinet.io.conf /etc/nginx/sites-enabled/api.papinet.io.conf
~$ sudo service nginx configtest
~$ sudo service nginx reload
~$ sudo service nginx status
```

3\. Test the installation by opening <http://api.papinet.io/orders> in a browser.

## Use _Let’s Encrypt_ to configure HTTPS

1\. Let's update the NGINX configuration by typing the following commands:

```text
~$ sudo apt-get update
~$ sudo apt-get install software-properties-common
~$ sudo add-apt-repository universe
~$ sudo add-apt-repository ppa:certbot/certbot
~$ sudo apt-get update
~$ sudo apt-get install certbot python3-certbot-nginx
~$ sudo certbot --nginx
```

2\. Test the installation by opening <https://api.papinet.io/orders> in a browser.
