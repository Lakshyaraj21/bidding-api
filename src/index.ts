import app from "./server";
import * as dotenv from "dotenv";
import logger from "./services/logging";
dotenv.config();

app.listen(process.env.PORT, () => {
  logger.info('Server is running on port: ' + process.env.PORT);
});
