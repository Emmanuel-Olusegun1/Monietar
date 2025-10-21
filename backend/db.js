import { supabase } from "./server.js";

export const insertUser = async (userData) => {
const { data, error } = await supabase.from("users").insert(userData).select();

  if (error) {
    console.error(error);
    throw new Error("User could not be created");
  }

  return data;
};