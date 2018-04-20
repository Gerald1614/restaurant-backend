module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'development':
        return {
          "URL": "http://localhost:3005",
          "port": 3005,
          "client_URL": "http://localhost:8080",
          "STATIC_DIR": __dirname,
          "mongoUrl": "mongodb://localhost:27017/restaurant-api",
          "bodyLimit": "100kb"
        };

    case 'production':
        return {
          "URL": "https://restaurant-review-api.gegeraptor.com",
          "port": 3005,
          "client_URL": 'https://restaurant-review-app-c6c0b.firebaseapp.com',
          "STATIC_DIR": "/home/apiuser/restaurant-backend/dist",
          "mongoUrl": "mongodb://localhost:27017/restaurant-api",
          "bodyLimit": "100kb"
        };
}
}