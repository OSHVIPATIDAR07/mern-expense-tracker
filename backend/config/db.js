import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://oshvi1111_db_user:6264636977oshvi@cluster0.ib7nbvf.mongodb.net/Expense")
      .then(()=> console.log("DB CONNECTED"));
}