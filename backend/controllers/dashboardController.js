// backend/controllers/dashboardController.js
import incomeModel from '../models/incomeModel.js';
import expenseModel from '../models/expenseModel.js';

export const getDashboardOverview = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch current month's incomes and expenses
        const incomes = await incomeModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: now }
        }).lean();

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: now }
        }).lean();

        // Calculate totals
        const monthlyIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const monthlyExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const savings = monthlyIncome - monthlyExpense;
        const savingRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;

        // Recent transactions (combining and sorting latest 5)
        const allTransactions = [
            ...incomes.map(item => ({ ...item, type: 'income' })),
            ...expenses.map(item => ({ ...item, type: 'expense' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const recentTransactions = allTransactions.slice(0, 5);

        // Spend by category calculation
        const categoryMap = {};
        expenses.forEach(item => {
            categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
        });

        const spendByCategory = Object.keys(categoryMap).map(category => ({
            category,
            amount: categoryMap[category]
        }));

        // Expense distribution for charts
        const expenseDistribution = spendByCategory.map(item => ({
            name: item.category,
            value: item.amount
        }));

        res.status(200).json({
            success: true,
            data: {
                monthlyIncome,
                monthlyExpense,
                savings,
                savingRate: Number(savingRate.toFixed(1)),
                recentTransactions,
                spendByCategory,
                expenseDistribution
            }
        });
    } catch (error) {
        console.error("Get dashboard overview error:", error);
        res.status(500).json({ success: false, message: "Dashboard fetch failed" });
    }
};