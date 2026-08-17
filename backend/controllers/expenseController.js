// backend/controllers/expenseController.js
import expenseModel from '../models/expenseModel.js';
import xlsx from 'xlsx';

// Add Expense
export const addExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, amount, category, date } = req.body;
        if (!description || !amount || !category || !date) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newExpense = await expenseModel.create({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        res.status(201).json({ success: true, message: "Expense added successfully", data: newExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get All Expenses
export const getAllExpense = async (req, res) => {
    try {
        const expenses = await expenseModel.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update Expense
export const updateExpense = async (req, res) => {
    try {
        const { description, amount, category } = req.body;
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { description, amount, category },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        res.json({ success: true, message: "Expense updated successfully", data: updatedExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        res.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Download Expense Excel Sheet
export const downloadExpenseExcel = async (req, res) => {
    try {
        const expenses = await expenseModel.find({ userId: req.user.id }).sort({ date: -1 });
        const plainData = expenses.map(item => ({
            Description: item.description,
            Amount: item.amount,
            Category: item.category,
            Date: new Date(item.date).toLocaleDateString()
        }));

        const worksheet = xlsx.utils.json_to_sheet(plainData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Expense");
        
        const filePath = "expense_details.xlsx";
        xlsx.writeFile(workbook, filePath);
        res.download(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};