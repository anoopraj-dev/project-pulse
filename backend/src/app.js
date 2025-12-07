import express from 'express';
import userRoutes from './routes/user.Routes.js';
import patientRoutes from './routes/patient.Routes.js'
import doctorRoutes from './routes/doctor.Routes.js'
import adminRoutes from './routes/admin.Routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'

const app = express();


//middlewares



app.use(cookieParser())
app.use(express.json())

app.use(
    session({
        secret:'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        cookie:{
            httpOnly: true,
            maxAge: 10*60*1000,
        }
    })
)


// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials:true,
// }));

// app.js or main server file - Add BEFORE routes:
app.use(cors({
  origin: 'http://localhost:5173',  // Vite default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// OR per-route:
app.options('/api/doctor/file-upload', cors());  // Handle preflight



//common auth routes for doctor and patient
app.use('/api/auth',userRoutes);

//patient routes
app.use('/api/patient',patientRoutes)

//doctor routes
app.use('/api/doctor',doctorRoutes)

//admin routes
app.use('/api/admin',adminRoutes)




export default app;