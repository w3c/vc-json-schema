## Building with Docker

See [example](https://github.com/w3c/webauthn/tree/master/docker/bikeshed)

#### Build the bikeshed docker image

```
docker build -t bikeshed docker/bikeshed --no-cache
```

#### Build the latest version of the spec

`./spec/` contains the spec files processed by bikeshed.

`./docs/` contains the build files that are hosted on github.

```
docker run --rm -v $(pwd):/spec bikeshed watch ./spec/index.bs ./docs/index.html
```
