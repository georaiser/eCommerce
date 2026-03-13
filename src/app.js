import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//middleware (allow sending json data to server)
app.use(express.json());

// Routes
app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`server started in http://localhost:${PORT}`)
});

