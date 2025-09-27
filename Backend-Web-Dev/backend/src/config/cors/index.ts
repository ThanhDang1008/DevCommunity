import { config } from "@/config.app";
import cors, { CorsOptions } from "cors";

const allowedOrigins = [
  config.CLIENT_URL, // miền 1
  config.CLIENT_URL2, // miền 2
  config.CLIENT_URL3, // miền 3
  config.CLIENT_URL4, // miền 4
];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "--- The CORS policy for this site does not " +
        "allow access from the specified Origin ---";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Nếu bạn cần gửi cookie hoặc thông tin xác thực
};

export default cors(corsOptions);

// require('dotenv').config()

// const configcors = (app)=>{
//     app.use((req, res, next) => {
//         res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || process.env.CLIENT_URL2|| process.env.CLIENT_URL3);
//         res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,UPDATE,PATCH,OPTIONS');
//         res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
//         res.header('Access-Control-Allow-Credentials', true);
//         next()
//     })
// }

// export default configcors;
