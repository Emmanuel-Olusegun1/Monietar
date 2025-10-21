import express from 'express';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerUser, loginUser } from './auth.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.post('/user/register', registerUser);
app.post('/user/login', loginUser);

app.get('/',(req, res)=>{
    return res.status(200).json({message: "All good bro"});
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});