import { supabase } from './server.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { insertUser } from './db.js';
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const isExisting = await supabase.from('users').select("*").eq('email', email);
        if (isExisting) {
            return res.status(401).json({ message: "User already registered" })
        }
        const hashedPassword = bcrypt.hash(password, 10)
        const userData = {
            email,
            password: hashedPassword,
            phone: phone || " "
        }
        const success = await insertUser(userData);
        if (!success) {
            throw "Insert error"
        }
        return res.status(200).json({ message: "User registered successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        let user;
        if (!email) {
            user = await supabase.from('users').select("*").eq('phone', phone);
        } else {
            user = await supabase.from('users').select("*").eq('email', email);
        }
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return res.status(200).json({ token })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
