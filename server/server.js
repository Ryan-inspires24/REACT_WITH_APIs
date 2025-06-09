import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import bodyParser from 'body-parser';
import submitRoute from './routes/formRoutes.js';
// import adminRoutes from './routes/adminRoute.js';


const app = express();

app.use(cors());

app.use(bodyParser.json());
// app.use('/api/admin', adminRoutes);
app.use('/api/submit', submitRoute);
const handler = serverless(app);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export { handler }; 

