import express from 'express';
import authRoutes from './routes/auth.Routes.js';
import patientRoutes from './routes/patient.Routes.js'
import doctorRoutes from './routes/doctor.Routes.js'
import adminRoutes from './routes/admin.Routes.js'
import webhookRoutes from './routes/webhook.Routes.js'
import userRoutes from './routes/user.Routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url';
import { monitorMiddleware } from './middlewares/monitor.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//middlewares
app.use(cookieParser())
app.use(express.json())

app.use(express.static("public"));
app.use('/exports',express.static(path.join(process.cwd(),'exports')))


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

app.use(monitorMiddleware)

app.use(cors({
  origin: 'http://localhost:5173',  // Vite default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.options('/api/doctor/file-upload', cors());  // Handle preflight

//----------- auth routes-----------------
app.use('/api/auth',authRoutes);

//--------------patient routes---------------
app.use('/api/patient',patientRoutes)

//--------------doctor routes--------------
app.use('/api/doctor',doctorRoutes)

//----------admin routes-------------
app.use('/api/admin',adminRoutes)

//----------- common routes -------------
app.use('/api',userRoutes)

//------ webhook routes ------------
app.use('/webhooks',webhookRoutes)




export default app;