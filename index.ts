import express, { Request, Response, Express } from "express";
import { getMotorcycles } from "./data"; // Adjust the path if needed
import { Motorcycle } from "./types"; // Ensure this path is correct

const app: Express = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

// Route to display all motorcycles
app.get("/", (req: Request, res: Response) => {
    const motorcycles: Motorcycle[] = getMotorcycles();
    res.render("index", { motorcycles });
});

app.listen(3000, () => {
    console.log(`The application is listening on http://localhost:3000`);
});