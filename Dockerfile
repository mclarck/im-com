FROM node:14
WORKDIR /usr/src/app 
COPY package*.json ./ 
RUN npm install 
# RUN npm ci --only=production
COPY . .
EXPOSE 5000
RUN ls -al
CMD ["npm", "run", "dev"]