import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./database";

interface AppError extends Error {
    status?: number;
}

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173',
        'https://packback-greengrocery.netlify.app'
    ]
}));

// --- MIDDLEWARE ---
// 1. Parse JSON applied to the queries body
app.use(express.json());

// 2. NoSQL Injection protection
// NOTE: express-mongo-sanitize's middleware() tries to reassign req.query,
// Use pure sanitize() function only on body/params
// (the only user-controlled inputs that matter for this app's queries).
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        const cleanBody = mongoSanitize.sanitize(req.body);
        if (JSON.stringify(cleanBody) !== JSON.stringify(req.body)) {
            console.warn(`Attempted NoSQL Injection attack in body`);
        }
        req.body = cleanBody;
    }
    if (req.params) {
        req.params = mongoSanitize.sanitize(req.params);
    }
    next();
});

// 3. Logging to debug
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// Import the routes
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import containerRoutes from "./routes/containerRoutes";
import ingredientRoutes from "./routes/ingredientRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import aiRoutes from "./routes/aiRoutes";
import resetPasswordRoutes from "./routes/resetPasswordRoutes";

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/stripe', stripeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/password", resetPasswordRoutes);

// Server port
const PORT = process.env.PORT || 3000;

// Started lissening on port 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --- ERROR HANDLING ---

// Error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error('Errore', err.message);

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;
module.exports = app;