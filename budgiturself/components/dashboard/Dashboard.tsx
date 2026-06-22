"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  CreditCard as CreditCardIcon,
  Plus,
  TrendingUp,
  Calendar,
  Wallet,
  Receipt,
  Home,
  Zap,
  LogOut
} from "lucide-react";
import { AddExpenseDialog } from "@/components/dashboard/AddExpenseDialog";
import { AddBillDialog } from "@/components/dashboard/AddBillDialog";
import { EditIncomeDialog } from "@/components/dashboard/EditIncomeDialog";
import type { CreditCard, OneOffExpense, Bill } from "@/components/dashboard/types";

export function Dashboard() {
  // Section 1: Current Financial State
  const [bankBalance, setBankBalance] = useState(3250.00);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    { id: "1", name: "Chase Sapphire", balance: 850.00, limit: 10000, color: "blue" },
    { id: "2", name: "AmEx Gold", balance: 425.50, limit: 5000, color: "yellow" },
    { id: "3", name: "Discover It", balance: 215.75, limit: 3000, color: "orange" },
  ]);
  const [oneOffExpenses, setOneOffExpenses] = useState<OneOffExpense[]>([
    { id: "1", name: "Medical Co-Pay", amount: 75.00, date: "2026-02-20" },
    { id: "2", name: "Car Maintenance", amount: 350.00, date: "2026-02-15" },
  ]);

  // Section 2: Income & Fixed Expenses
  const [monthlyIncome, setMonthlyIncome] = useState(5200.00);
  const [baseRent, setBaseRent] = useState(1800.00);
  const [utilities, setUtilities] = useState(150.00);

  // Section 3: Monthly Bills
  const [bills, setBills] = useState<Bill[]>([
    { id: "1", name: "Netflix", amount: 15.99, chargeDate: 1, card: "Chase Sapphire", category: "Entertainment" },
    { id: "2", name: "Spotify", amount: 10.99, chargeDate: 5, card: "Chase Sapphire", category: "Entertainment" },
    { id: "3", name: "Adobe Creative Cloud", amount: 54.99, chargeDate: 10, card: "AmEx Gold", category: "Software" },
    { id: "4", name: "Planet Fitness", amount: 24.99, chargeDate: 15, card: "Discover It", category: "Health" },
    { id: "5", name: "Amazon Prime", amount: 14.99, chargeDate: 20, card: "Chase Sapphire", category: "Shopping" },
    { id: "6", name: "iCloud Storage", amount: 2.99, chargeDate: 8, card: "Chase Sapphire", category: "Software" },
  ]);

  // Dialogs state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [showEditIncome, setShowEditIncome] = useState(false);

  // Calculations
  const totalCreditCardDebt = creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalOneOffExpenses = oneOffExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalCurrentObligations = totalCreditCardDebt + totalOneOffExpenses;

  const digitalBillsTotal = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalFixedExpenses = baseRent + utilities + digitalBillsTotal;
  const safeToSpend = monthlyIncome - totalFixedExpenses;

  // Section 4: The Final Math
  const trueLiquidWealth = bankBalance - totalCurrentObligations;
  const horizonView = bankBalance + monthlyIncome - totalCurrentObligations - totalFixedExpenses;

  // Handlers
  const handleAddOneOffExpense = (expense: Omit<OneOffExpense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setOneOffExpenses([...oneOffExpenses, newExpense]);
  };

  const handleAddBill = (bill: Omit<Bill, "id">) => {
    const newBill = {
      ...bill,
      id: Date.now().toString(),
    };
    setBills([...bills, newBill]);
  };

  const handleRemoveExpense = (id: string) => {
    setOneOffExpenses(oneOffExpenses.filter(exp => exp.id !== id));
  };

  const handleRemoveBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-900/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/50 transition-transform hover:scale-105">
              <DollarSign className="size-5 text-white" />
            </div>
            <span className="text-lg text-white font-medium">Smart Ledger</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-blue-900/30 transition-all">
                <Home className="mr-2 size-4" />
                Home
              </Button>
            </Link>
            <a href="/auth/logout">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-blue-900/30 transition-all">
                <LogOut className="mr-2 size-4" />
                Sign Out
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 mb-2 font-bold">Dashboard</h1>
          <p className="text-gray-400">Your complete financial overview</p>
        </div>

        {/* Section 4 First: The Horizon View - Most Important Info */}
        <Card className="mb-8 border-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-[1.01]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur">
                <TrendingUp className="size-6 text-white" />
              </div>
              The Horizon View
            </CardTitle>
            <CardDescription className="text-blue-50">Your true financial position after all obligations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <p className="text-xs text-blue-600 mb-2 uppercase tracking-wide font-medium">Current Liquid Cash</p>
                <p className="text-3xl text-gray-900 font-bold">${bankBalance.toFixed(2)}</p>
                <div className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              </div>
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <p className="text-xs text-blue-600 mb-2 uppercase tracking-wide font-medium">After Current Obligations</p>
                <p className={`text-3xl font-bold ${trueLiquidWealth >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                  ${trueLiquidWealth.toFixed(2)}
                </p>
                <div className={`mt-3 h-1 ${trueLiquidWealth >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'} rounded-full`}></div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur rounded-xl p-6 transition-all hover:shadow-2xl hover:shadow-yellow-500/50 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <p className="text-xs text-yellow-950 mb-2 uppercase tracking-wide font-bold relative z-10">True Leftover (This Month)</p>
                <p className={`text-3xl relative z-10 font-bold ${horizonView >= 0 ? 'text-white' : 'text-red-900'}`}>
                  ${horizonView.toFixed(2)}
                </p>
                <p className="text-xs text-yellow-950/80 mt-2 relative z-10">
                  Balance + Income - All Obligations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Section 1: Liquidity & Debt Overview */}
          <Card className="border-0 bg-slate-900/50 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-500/10">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="flex items-center gap-3 text-lg text-white">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg shadow-purple-500/50 transition-transform hover:scale-110">
                  <Wallet className="size-5 text-white" />
                </div>
                Current Financial State
              </CardTitle>
              <CardDescription className="text-gray-400">Your liquid assets and current obligations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Bank Balance */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/30 transition-all hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20">
                <p className="text-xs text-green-400 mb-1 uppercase tracking-wide font-medium">Bank Account Balance</p>
                <p className="text-2xl text-white font-bold">${bankBalance.toFixed(2)}</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-3/4"></div>
              </div>

              {/* Credit Cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-300 font-medium">Credit Cards</h3>
                  <span className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full font-medium">
                    ${totalCreditCardDebt.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-3">
                  {creditCards.map((card) => (
                    <div key={card.id} className="bg-slate-800/50 rounded-xl p-4 border border-gray-700 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="size-4 text-blue-400" />
                          <span className="text-sm text-white">{card.name}</span>
                        </div>
                        <span className="text-sm text-gray-300 font-medium">${card.balance.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(card.balance / card.limit) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {((card.balance / card.limit) * 100).toFixed(0)}% of ${card.limit.toLocaleString()} limit
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* One-Off Expenses */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-300 font-medium">One-Off Expenses</h3>
                  <Button size="sm" onClick={() => setShowAddExpense(true)} className="h-8 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-105">
                    <Plus className="size-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {oneOffExpenses.map((expense) => (
                    <div key={expense.id} className="bg-slate-800/50 rounded-xl p-3 border border-gray-700 flex items-center justify-between transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10">
                      <div>
                        <p className="text-sm text-white">{expense.name}</p>
                        <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300 font-medium">${expense.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="size-6 p-0 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  {oneOffExpenses.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No expenses</p>
                  )}
                </div>
              </div>

              {/* Total Obligations */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-4 border-2 border-red-500/30 transition-all hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20">
                <p className="text-xs text-red-400 mb-1 uppercase tracking-wide font-medium">Total Current Obligations</p>
                <p className="text-2xl text-white font-bold">${totalCurrentObligations.toFixed(2)}</p>
                <div className="mt-2 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-2/3"></div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Income & Fixed Commitments */}
          <Card className="border-0 bg-slate-900/50 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-500/10">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="flex items-center gap-3 text-lg text-white">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg shadow-lg shadow-green-500/50 transition-transform hover:scale-110">
                  <TrendingUp className="size-5 text-white" />
                </div>
                Income & Fixed Expenses
              </CardTitle>
              <CardDescription className="text-gray-400">Your monthly income and non-negotiable costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Monthly Income */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-300 font-medium">Monthly Income (After Tax)</h3>
                  <Button size="sm" variant="outline" onClick={() => setShowEditIncome(true)} className="h-8 text-xs border-gray-600 text-gray-300 hover:bg-slate-800 hover:text-white hover:border-blue-500 transition-all">
                    Edit
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/30 transition-all hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20">
                  <p className="text-2xl text-white font-bold">${monthlyIncome.toFixed(2)}</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                </div>
              </div>

              {/* Fixed Expenses */}
              <div>
                <h3 className="text-sm text-gray-300 mb-3 font-medium">Fixed Expenses</h3>
                <div className="space-y-2">
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-gray-700 flex items-center justify-between transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 group">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-500/20 p-1.5 rounded-lg transition-all group-hover:bg-purple-500/30">
                        <Home className="size-4 text-purple-400" />
                      </div>
                      <span className="text-sm text-white">Base Rent</span>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">${baseRent.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-gray-700 flex items-center justify-between transition-all hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 group">
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-500/20 p-1.5 rounded-lg transition-all group-hover:bg-yellow-500/30">
                        <Zap className="size-4 text-yellow-400" />
                      </div>
                      <span className="text-sm text-white">Utilities</span>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">${utilities.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-gray-700 flex items-center justify-between transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 group">
                    <div className="flex items-center gap-2">
                      <div className="bg-cyan-500/20 p-1.5 rounded-lg transition-all group-hover:bg-cyan-500/30">
                        <Receipt className="size-4 text-cyan-400" />
                      </div>
                      <span className="text-sm text-white">Digital Bills</span>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">${digitalBillsTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Total Fixed Expenses */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-gray-700 transition-all hover:border-gray-500">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Total Fixed Expenses</p>
                <p className="text-2xl text-white font-bold">${totalFixedExpenses.toFixed(2)}</p>
              </div>

              {/* Safe to Spend */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-xl p-4 shadow-xl shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <p className="text-xs text-blue-100 mb-1 uppercase tracking-wide font-bold relative z-10">Safe to Spend (Monthly)</p>
                <p className={`text-2xl relative z-10 font-bold ${safeToSpend >= 0 ? 'text-white' : 'text-red-200'}`}>
                  ${safeToSpend.toFixed(2)}
                </p>
                <p className="text-xs text-blue-100 mt-2 relative z-10">Income - Fixed Expenses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Monthly Bills Breakdown */}
        <Card className="border-0 bg-slate-900/50 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-500/10">
          <CardHeader className="border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-indigo-500/50 transition-transform hover:scale-110">
                    <Calendar className="size-5 text-white" />
                  </div>
                  Monthly Bills Breakdown
                </CardTitle>
                <CardDescription className="text-gray-400">Your subscriptions and recurring charges</CardDescription>
              </div>
              <Button onClick={() => setShowAddBill(true)} className="h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:scale-105">
                <Plus className="size-4 mr-2" />
                Add Bill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {bills
                .sort((a, b) => a.chargeDate - b.chargeDate)
                .map((bill) => (
                  <div key={bill.id} className="bg-slate-800/50 rounded-xl p-4 border border-gray-700 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm text-white font-medium">{bill.name}</h4>
                          <span className="text-xs bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                            {bill.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <div className="bg-indigo-500/20 p-1 rounded transition-all group-hover:bg-indigo-500/30">
                              <Calendar className="size-3 text-indigo-400" />
                            </div>
                            {bill.chargeDate}{bill.chargeDate === 1 ? 'st' : bill.chargeDate === 2 ? 'nd' : bill.chargeDate === 3 ? 'rd' : 'th'} of month
                          </span>
                          <span className="flex items-center gap-1.5">
                            <div className="bg-purple-500/20 p-1 rounded transition-all group-hover:bg-purple-500/30">
                              <CreditCardIcon className="size-3 text-purple-400" />
                            </div>
                            {bill.card}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300 font-medium">${bill.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveBill(bill.id)}
                          className="size-7 p-0 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              {bills.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm">No bills added yet</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/30">
                <span className="text-sm text-gray-300 font-medium">Total Monthly Bills</span>
                <span className="text-xl text-white font-bold">${digitalBillsTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddExpenseDialog
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onAdd={handleAddOneOffExpense}
      />
      <AddBillDialog
        open={showAddBill}
        onOpenChange={setShowAddBill}
        onAdd={handleAddBill}
        creditCards={creditCards.map(c => c.name)}
      />
      <EditIncomeDialog
        open={showEditIncome}
        onOpenChange={setShowEditIncome}
        currentIncome={monthlyIncome}
        onSave={setMonthlyIncome}
        currentRent={baseRent}
        onSaveRent={setBaseRent}
        currentUtilities={utilities}
        onSaveUtilities={setUtilities}
      />
    </div>
  );
}
