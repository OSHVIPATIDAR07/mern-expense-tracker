
// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id };
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
};

export default authMiddleware;// import User from '../models/userModel.js';
// import incomeModel from '../models/incomeModel.js';
// import xlsx from 'xlsx';

// export const addIncome = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { description, amount, category, date } = req.body;
//         if (!description || !amount || !category || !date) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         const newIncome = await incomeModel.create({
//             userId,
//             description,
//             amount,
//             category,
//             date: new Date(date)
//         });

//         res.status(201).json({ success: true, message: "Income added successfully", data: newIncome });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// export const getAllIncome = async (req, res) => {
//     try {
//         const incomes = await incomeModel.find({ userId: req.user.id }).sort({ date: -1 });
//         res.json(incomes);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// export const deleteIncome = async (req, res) => {
//     try {
//         const income = await incomeModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//         if (!income) {
//             return res.status(404).json({ success: false, message: "Income not found" });
//         }
//         res.json({ success: true, message: "Income deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// export const downloadIncomeExcel = async (req, res) => {
//     try {
//         const incomes = await incomeModel.find({ userId: req.user.id }).sort({ date: -1 });
//         const plainData = incomes.map(item => ({
//             Description: item.description,
//             Amount: item.amount,
//             Category: item.category,
//             Date: new Date(item.date).toLocaleDateString()
//         }));

//         const worksheet = xlsx.utils.json_to_sheet(plainData);
//         const workbook = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(workbook, worksheet, "Income");
        
//         const filePath = "income_details.xlsx";
//         xlsx.writeFile(workbook, filePath);
//         res.download(filePath);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };