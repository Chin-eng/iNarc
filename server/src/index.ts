import express, { Express } from "express";
import { addFood, listFoods, deleteFood, updateDay, getDay} from './routes';
import bodyParser from 'body-parser';

// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/add", addFood)
app.post("/api/delete", deleteFood)
app.post("/api/updateDay", updateDay)
app.get("/api/getDay", getDay)
app.get("/api/list", listFoods)
app.listen(port, () => console.log(`Server listening on ${port}`));
