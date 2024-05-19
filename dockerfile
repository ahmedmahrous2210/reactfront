# base image
FROM node:13.12.0-alpine3.10

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install 
RUN npm install react-scripts@3.4.1
RUN npm run build
# start app
CMD ["npm", "start"]


