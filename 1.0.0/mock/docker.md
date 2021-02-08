To run the mocks on Docker

1\. Build the docker image
```docker build -t papinet/api-mock . ```

2\. Run the docker docker image
```docker run -p 49160:3001 -d ```

3\. Check locally if the papiNet mock service is properly running:
```~$ curl localhost:49160/orders```