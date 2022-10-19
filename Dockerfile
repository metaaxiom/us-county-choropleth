FROM node:16.5.0-alpine
WORKDIR /app
COPY . .
ENV PUBLIC_URL /population-choropleth
RUN npm ci
RUN npm run build

FROM nginx:1.23.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]