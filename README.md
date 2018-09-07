# IOT Milestone 1: Blossomforth

## Building the docker image

To build the image, use `docker build` inside the application directory:

```
$ docker build -t fancy-pants/iot-assignment .
```

## Running the docker image

To create a container from the created image and run the application, use the
`docker run` command:

```
$ docker run -d --rm -p 8080:8080 --privileged fancy-pants/iot-assignment
```

