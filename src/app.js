import e from "express";
import cors from "cors"
import noromboRoutes from "./routes/noromboRoutes.js"
import { config } from "dotenv";

config()

const app = e();
const port = process.env.PORT || 4500

// Middleware to parse JSON request bodies
app.use(e.json())
app.use(cors({credentials:true , origin:"*"}))


// Routes
app.use("/" , noromboRoutes)

// Listning Express App

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})