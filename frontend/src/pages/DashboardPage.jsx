import React, { useState, useEffect, useMemo } from 'react';
//import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { 
  Wallet, ArrowDown, PiggyBank, BarChart2, TrendingUp, TrendingDown, 
  Plus, ShoppingCart, DollarSign, PieChart, Info, ChevronDown, ChevronUp 
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import { dashboardStyles, trendStyles } from '../assets/dummyStyles';
import { GAUGE_COLORS, COLORS } from '../assets/color';

import { getFrameRange, getPreviousFrameRange, calculateData } from '../utils/helpers';
import FinancialCard from '../components/FinancialCard';
import GauCard from '../components/GaugeCard';
import AddTransactionModal from '../components/AddTransactionalModal';

const API_BASE = "http://localhost:4000/api";


const getAuthHeader = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toClientISO = (dateStr) => {
  return new Date(dateStr).toISOString();
};

// const DashboardPage = () => {
//   const { refreshTransactions } = useOutletContext();
const DashboardPage = ({ refreshTransactions }) => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [showModal, setShowModal] = useState(false);
  const [gauData, setGauData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overviewMeta, setOverviewMeta] = useState({
    monthlyIncome: 0,
    monthlyExpense: 0,
    savings: 0,
    savingRate: 0,
    spendByCategory: [],
    expenseDistribution: [],
    recentTransactions: []
  });

  const [showAllIncome, setShowAllIncome] = useState(false);
  const [showAllExpense, setShowAllExpense] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'food'
  });

  const timeFrameRange = useMemo(() => getFrameRange(timeFrame), [timeFrame]);
  const previousTimeFrameRange = useMemo(() => getPreviousFrameRange(timeFrame), [timeFrame]);

  const isDateInRange = (date, start, end) => {
    const d = new Date(date);
    return d >= new Date(start) && d <= new Date(end);
  };

  useEffect(() => {
    // Update gauge target metrics dynamically
    setGauData([
      { name: 'Income', value: overviewMeta.monthlyIncome, max: 5000, color: GAUGE_COLORS.Income },
      { name: 'Spent', value: overviewMeta.monthlyExpense, max: 3000, color: GAUGE_COLORS.Spent },
      { name: 'Saving', value: overviewMeta.savings, max: 2000, color: GAUGE_COLORS.Savings }
    ]);
  }, [overviewMeta]);

  const displayIncome = overviewMeta.monthlyIncome;
  const displayExpense = overviewMeta.monthlyExpense;
  const displaySavings = overviewMeta.savings;
  const expenseChange = 0; // Derived metric

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/dashboard`, {
        headers: getAuthHeader()
      });

      if (response.data?.success) {
        const data = response.data.data;
        setOverviewMeta({
          monthlyIncome: data.monthlyIncome || 0,
          monthlyExpense: data.monthlyExpense || 0,
          savings: data.savings || 0,
          savingRate: data.savingRate || 0,
          spendByCategory: data.spendByCategory || [],
          expenseDistribution: data.expenseDistribution || [],
          recentTransactions: data.recentTransactions || []
        });
      }
    } catch (err) {
      console.error('Fetch dashboard overview failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) return;

    const payload = {
      date: toClientISO(newTransaction.date),
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category
    };

    try {
      setLoading(true);
      if (newTransaction.type === 'income') {
        await axios.post(`${API_BASE}/income/add`, payload, { headers: getAuthHeader() });
      } else {
        await axios.post(`${API_BASE}/expense/add`, payload, { headers: getAuthHeader() });
      }

      await refreshTransactions();
      await fetchDashboardOverview();

      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'expense',
        category: 'food'
      });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add transaction:', err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={dashboardStyles.container}>
      {/* Header Container */}
      <div className={dashboardStyles.headerContainer}>
        <div>
          <h1 className={dashboardStyles.headerTitle}>Finance Dashboard</h1>
          <p className={dashboardStyles.headerSubtitle}>Track your income and expenses</p>
        </div>
        <button className={dashboardStyles.addButton} onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Time Frame Filter Selector */}
      <div className={dashboardStyles.timeFrameContainer}>
        <div className={dashboardStyles.timeFrameWrapper}>
          {['daily', 'weekly', 'monthly'].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`${dashboardStyles.timeFrameButton} ${timeFrame === frame ? 'active' : ''}`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className={dashboardStyles.summaryGrid}>
        <FinancialCard
          icon={
            <div className={dashboardStyles.walletIconContainer}>
              <Wallet className="w-5 h-5 text-teal-600" />
            </div>
          }
          label="Total Balance"
          value={`$${Math.round(displayIncome - displayExpense).toLocaleString()}`}
          additionalContent={
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className={dashboardStyles.balanceBadge}>
                +${Math.round(displayIncome).toLocaleString()}
              </span>
              <span className={dashboardStyles.expenseBadge}>
                -${Math.round(displayExpense).toLocaleString()}
              </span>
            </div>
          }
        />

        <FinancialCard
          icon={
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <ArrowDown className="w-5 h-5" />
            </div>
          }
          label={`${timeFrameRange.label} Expenses`}
          value={`$${displayExpense.toLocaleString()}`}
          additionalContent={
            <div className={`mt-2 text-xs flex items-center gap-1 ${expenseChange >= 0 ? trendStyles.positive : trendStyles.negative}`}>
              {expenseChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(expenseChange)}% {expenseChange >= 0 ? 'increase' : 'decrease'} from {previousTimeFrameRange.label}</span>
            </div>
          }
        />

        <FinancialCard
          icon={
            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-600">
              <PiggyBank className="w-5 h-5" />
            </div>
          }
          label={`${timeFrameRange.label} Savings`}
          value={`$${displaySavings.toLocaleString()}`}
          additionalContent={
            <div className="mt-2 text-xs text-cyan-600 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <BarChart2 className="w-4 h-4" />
                <span>{displayIncome > 0 ? Math.round((displaySavings / displayIncome) * 100) : 0}% of income</span>
              </div>
              {typeof overviewMeta.savingRate === 'number' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${overviewMeta.savingRate < 0 ? trendStyles.negativeRate : trendStyles.positiveRate}`}>
                  {overviewMeta.savingRate}%
                </span>
              )}
            </div>
          }
        />
      </div>

      {/* Gauges Grid Section */}
      <div className={dashboardStyles.gossGrid}>
        {gauData.map((gau) => (
          <GauCard 
            key={gau.name} 
            goss={gau} 
            colorInfo={GAUGE_COLORS}
            timeFrameLabel={timeFrameRange.label} 
          />
        ))}
      </div>

      {/* Expense Distribution & Recent Transactions Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Expense Distribution (Pie Chart) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500" />
            Expense Distribution
          </h3>
          <div className="h-64">
            {overviewMeta.expenseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={overviewMeta.expenseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {overviewMeta.expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 mt-20">No expense data to display</p>
            )}
          </div>
        </div>

        {/* Spend by Category List */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-purple-500" />
            Spend by Category
          </h3>
          <div className="space-y-4">
            {overviewMeta.spendByCategory.map((cat) => (
              <div key={cat.category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700 capitalize">{cat.category}</span>
                </div>
                <span className="font-bold text-gray-900">${cat.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Adding Transactions */}
      {showModal && (
        <AddTransactionModal
          showModal={showModal}
          setShowModal={setShowModal}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
          handleAddTransaction={handleAddTransaction}
          loading={loading}
        />
      )}
    </div>
  );
};

export default DashboardPage;