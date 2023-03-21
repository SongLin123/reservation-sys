# Check out https://hub.docker.com/_/node to select a new base image
FROM node:18-slim

# Set to a non-root built-in user `node`
USER node


# Create app directory (with user `node`)
RUN mkdir -p /home/node/app/frontend

# Bundle frontend source code
WORKDIR /home/node/app/frontend

COPY --chown=node frontend/package*.json .

RUN npm install --legacy-peer-deps


COPY --chown=node ./frontend .



# Bundle app source code
WORKDIR /home/node/app

COPY --chown=node package*.json .

RUN npm install

COPY --chown=node . .


RUN npm run build:all



# # Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD [ "node", "./dist" ]
