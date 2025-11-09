import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerUser, loginUser, validateBusiness, sendVerifyMail, verifyEmail } from './auth.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/verify/mail', sendVerifyMail);
app.get('/verify-email', verifyEmail);
app.post('/api/auth/validate-business', validateBusiness);
app.get('/',(req, res)=>{
    return res.status(200).json({message: "All good bro"});
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});