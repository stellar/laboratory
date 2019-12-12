# Check if we need to prepend docker commands with sudo
SUDO := $(shell docker version >/dev/null 2>&1 || echo "sudo")

# If LABEL is not provided set default value
LABEL ?= $(shell git rev-parse --short HEAD)$(and $(shell git status -s),-dirty-$(shell id -u -n))
# If TAG is not provided set default value
TAG ?= docker-registry.services.stellar-ops.com/dev/laboratory:$(LABEL)

docker-build:
	$(SUDO) docker build -t $(TAG) .

docker-push:
	$(SUDO) docker push $(TAG)
