FROM denoland/deno:latest
LABEL Name=denoplayground Version=0.0.1
RUN apt-get -y update && apt-get install -y git vim curl

# RUN curl -sfL $(curl -s https://api.github.com/repos/powerman/dockerize/releases/latest | grep -i /dockerize-$(uname -s)-$(uname -m)\" | cut -d\" -f4) | install /dev/stdin /usr/local/bin/dockerize

# RUN dockerize -wait tcp://mongo:27017 -timeout 300s -wait-retry-interval 30s

# The port on which your application listens
EXPOSE 8080

WORKDIR /

# Prefer not to run as root
USER deno

# TODO -
# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry
RUN deno cache src/index.ts

CMD ["run", "--allow-env", "--allow-net", "--allow-read", "--config", "deno.jsonc", "src/index.ts"]
