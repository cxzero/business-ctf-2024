FROM alpine:20240329
ENV DEBIAN_FRONTEND noninteractive

RUN apk add --no-cache socat dash && ln -sf /usr/bin/dash /bin/sh

RUN addgroup -g 1000 ctf && adduser -u 1000 -G ctf -h /home/ctf -D ctf

ADD --chown=ctf challenge/* /home/ctf/

RUN chown -R root:ctf /home/ctf

WORKDIR /home/ctf

EXPOSE 1337/tcp

ENTRYPOINT ["socat", "TCP-LISTEN:1337,fork", "EXEC:'/home/ctf/regularity'"]