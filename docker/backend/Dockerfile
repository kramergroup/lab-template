FROM alpine

ENV UID=1000
ENV GID=1000

RUN apk add openssh

RUN adduser -u $UID -D backend && \
    echo "backend:$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c24)" | chpasswd

ENTRYPOINT [ "/bin/sh", "-c", "ssh-keygen -A && /usr/sbin/sshd -D" ]