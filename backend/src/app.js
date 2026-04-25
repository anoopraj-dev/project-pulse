import express from 'express';
import authRoutes from './routes/auth.Routes.js';
import patientRoutes from './routes/patient.Routes.js'
import doctorRoutes from './routes/doctor.Routes.js'
import adminRoutes from './routes/admin.Routes.js'
import userRoutes from './routes/user.Routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url';
import { monitorMiddleware } from './middlewares/monitor.js';
import morgan from 'morgan'
import fs from 'fs'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//middlewares
app.use(cookieParser())
app.use(express.json())

app.use(express.static("public"));
app.use('/exports',express.static(path.join(process.cwd(),'exports')))

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(
  path.join(logDir, "access.log"),
  { flags: "a" }
);

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'))
}else{
    app.use(morgan('dev'))
}

app.set("trust proxy", 1); 

app.use(
  session({
    secret: 'SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      secure: true,                
      sameSite: "none"            
    }
  })
);

app.use(monitorMiddleware)

app.use(cors({
  origin: process.env.CLIENT_URL,  
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






export default app;