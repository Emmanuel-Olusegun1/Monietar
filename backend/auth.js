import { supabase } from './server.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import nodemailer from 'nodemailer';
import { insertUser } from './db.js';
dotenv.config();

const user = process.env.AUTH_EMAIL;
const password = process.env.AUTH_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
    try {
        const { email, signup_method, password, business_name, name } = req.body;

        if(!email  || !password || !business_name || !name){
            throw "Incomplete Form"
        }
        let isExisting;
        
        if(signup_method == 'email'){
            console.log(isExisting, "User already registered")
            isExisting = await supabase.from('users').select("*").eq('email', email).data;
        }
        console.log(isExisting)
        if (isExisting) {
            console.log(isExisting, "User already registered");
            return res.status(401).json({ status: 401, message: "User already registered" })
        }
        console.log(email)
        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = {
            id: uuidv4(),
            email,
            password: hashedPassword,
            business_name,
            name
        }
        console.log(userData);
        const success = await insertUser(userData);
        if (!success) {
            throw "Insert error"
        }
        return res.status(200).json({ status: 200, message: "User registered successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "Internal server error" })
    }
}

export const validateBusiness = async (req, res) => {
    try{
        const {business_name} = req.body;
        const isBusNameTaken = await supabase.from('users').select("*").eq('business_name', business_name);
        console.log(isBusNameTaken)
        if (isBusNameTaken.count) {
            return res.status(200).json({ available: false, message: "Business name already taken" });
        }else if(isBusNameTaken.error){
            throw isBusNameTaken.error;
        }
        return res.status(200).json({ available: true, message: "Business name Available" });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const sendVerifyMail = async (req,res) =>{
    try{
        const { email } = req.body;
        const verifyToken = jwt.sign({email}, JWT_SECRET, {expiresIn: '10m'});
        console.log(email)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: password,
            },
        });
        const mailOptions = {
            from: "monietar@authentication.com",
            to: email,
            subject: `Email Verification`,
            html: `<p>You have recieved this emal as you have successufully registered an account for our services </p><br>
                   <p>CLick the Verify button below to verify your emial address to use your account <p><br>
                   <a href="http://localhost:5000/verify-email?token=${verifyToken}" style="padding: 6px; backgroud: blue; border: white 1px solid" >Verify</a>
                   
                   <p><em>If button not working, copy and paste this link in your browser http://localhost:5000/verify-email?token=${verifyToken} </em></p>`
        }
        console.log(mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        
        return res.status(200).json({ message: 'Form submitted successfully' });
    }catch(error){
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        let user;
        if (!email) {
            user = await supabase.from('users').select("*").eq('phone', phone).single();
        } else {
            user = await supabase.from('users').select("*").eq('email', email).single();
        }
        if (!user.data) {
            return res.status(401).json({status: 401, message: "User not found" })
        }
        console.log(user);
        const isPasswordCorrect = await bcrypt.compare(password, user.data.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({status: 401, message: "Invalid credentials" })
        }
        if(!user.data.verified) return res.status(403).json({status: 403, message: "User Email not verified"})
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return res.status(200).json({status: 200, message: "User logged in successfully", token })
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 500, message: "Internal server error" })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send("<h1>Invalid verification link.</h1>");
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { email } = decoded;

        const { data, error } = await supabase
            .from('users')
            .update({ verified: true })
            .eq('email', email)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).send("<h1>User not found.</h1>");
        }

        // I'm assuming your frontend sign-in page is at '/signin'. You can change this URL.
        const frontendSignInUrl = 'http://localhost:5000/auth/signin';

        return res.send(`
            <html>
                <head><title>Email Verified</title></head>
                <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                    <h1>Email Verified Successfully!</h1>
                    <p>You will be redirected to the sign-in page shortly.</p>
                    <script>setTimeout(() => { window.location.href = '${frontendSignInUrl}'; }, 3000);</script>
                </body>
            </html>
        `);
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(400).send("<h1>Verification link is invalid or has expired.</h1>");
        }
        return res.status(500).send("<h1>Internal Server Error</h1>");
    }
};
