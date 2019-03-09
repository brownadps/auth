#!/bin/sh
docker build -t auth . && \
docker run -itd \
--network proxy \
--network-alias proxy \
--name auth \
--env-file "../.env" \
auth
