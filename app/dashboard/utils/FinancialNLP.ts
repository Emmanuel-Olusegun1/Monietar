export class AdvancedFinancialNLP {
  static processQuery(
    query: string,
    transactions: any[],
    budgets: any[],
    formatCurrency: (amount: number) => string
  ): string {
    const lowerQuery = query.toLowerCase();
    
    // Calculate basic financial metrics
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const profit = totalIncome - totalExpenses;

    // Query patterns
    if (lowerQuery.includes('how much') || lowerQuery.includes('what is my')) {
      if (lowerQuery.includes('income') || lowerQuery.includes('revenue')) {
        return `Your total income is ${formatCurrency(totalIncome)}.`;
      }
      if (lowerQuery.includes('expense') || lowerQuery.includes('spending')) {
        return `Your total expenses are ${formatCurrency(totalExpenses)}.`;
      }
      if (lowerQuery.includes('profit') || lowerQuery.includes('net')) {
        return `Your net profit is ${formatCurrency(profit)}.`;
      }
      if (lowerQuery.includes('balance')) {
        return `Based on your transactions: Income ${formatCurrency(totalIncome)}, Expenses ${formatCurrency(totalExpenses)}, Net Profit ${formatCurrency(profit)}.`;
      }
    }

    if (lowerQuery.includes('budget') || lowerQuery.includes('spending limit')) {
      if (budgets.length === 0) {
        return "You haven't set up any budgets yet. Create budgets to track your spending limits.";
      }
      
      const budgetStatus = budgets.map(budget => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        const percentage = (spent / budget.budget_limit) * 100;
        return `${budget.category}: ${formatCurrency(spent)} of ${formatCurrency(budget.budget_limit)} (${Math.round(percentage)}%)`;
      }).join('\n');
      
      return `Here's your budget status:\n${budgetStatus}`;
    }

    if (lowerQuery.includes('category') || lowerQuery.includes('where am i spending')) {
      const expenseByCategory: { [key: string]: number } = {};
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        });

      if (Object.keys(expenseByCategory).length === 0) {
        return "No expense data available to analyze spending by category.";
      }

      const categoryBreakdown = Object.entries(expenseByCategory)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([category, amount]) => `${category}: ${formatCurrency(amount as number)}`)
        .join('\n');

      return `Your top spending categories:\n${categoryBreakdown}`;
    }

    if (lowerQuery.includes('advice') || lowerQuery.includes('recommendation') || lowerQuery.includes('suggestion')) {
      const recommendations = [];
      
      if (profit < 0) {
        recommendations.push(`Your expenses exceed income by ${formatCurrency(Math.abs(profit))}. Focus on reducing costs or increasing revenue.`);
      }
      
      if (totalExpenses > totalIncome * 0.8) {
        recommendations.push("Your expense ratio is high. Consider optimizing operational costs.");
      }
      
      if (recommendations.length === 0) {
        recommendations.push("Your finances look healthy! Consider setting up budgets for better control.");
      }
      
      return `Financial advice:\n${recommendations.join('\n')}`;
    }

    // Default response for unrecognized queries
    return "I can help you analyze your income, expenses, budgets, and provide financial insights. Try asking about your spending, budgets, or financial summary.";
  }
}