export class RuleBasedFinancialAdvisor {
  static analyzeSpendingPatterns(
    transactions: any[],
    budgets: any[],
    formatCurrency: (amount: number) => string
  ): string[] {
    const recommendations: string[] = [];
    
    if (!transactions || transactions.length === 0) {
      return [
        'Add your transactions to get personalized financial insights',
        'Create budgets to track your spending limits',
        'Monitor your income and expense patterns regularly'
      ];
    }

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const profit = totalIncome - totalExpenses;

    // Profitability analysis
    if (profit < 0) {
      recommendations.push(`Your expenses exceed income by ${formatCurrency(Math.abs(profit))}. Consider reducing costs or increasing revenue.`);
    } else if (profit / totalIncome < 0.1) {
      recommendations.push(`Your profit margin is low (${((profit / totalIncome) * 100).toFixed(1)}%). Look for ways to improve efficiency.`);
    } else {
      recommendations.push(`Great! You're maintaining a healthy profit margin of ${((profit / totalIncome) * 100).toFixed(1)}%.`);
    }

    // Budget analysis
    if (budgets && budgets.length > 0) {
      budgets.forEach(budget => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const percentage = (spent / budget.budget_limit) * 100;
        
        if (percentage > 90) {
          recommendations.push(`⚠️ ${budget.category} budget is ${Math.round(percentage)}% used. Consider adjusting your spending.`);
        }
      });
    }

    // Spending pattern analysis
    const expenseByCategory: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    const highestSpendingCategory = Object.entries(expenseByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (highestSpendingCategory) {
      recommendations.push(`Your highest spending category is ${highestSpendingCategory[0]} (${formatCurrency(highestSpendingCategory[1] as number)}). Review if this aligns with your business priorities.`);
    }

    // Ensure we have at least 3 recommendations
    while (recommendations.length < 3) {
      recommendations.push('Regularly review your financial reports to stay on top of your business performance.');
    }

    return recommendations.slice(0, 4);
  }
}