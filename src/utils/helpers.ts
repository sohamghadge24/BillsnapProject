export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food & Dining': '#EF4444',
    'Transportation': '#3B82F6',
    'Groceries': '#10B981',
    'Entertainment': '#8B5CF6',
    'Healthcare': '#F59E0B',
    'Shopping': '#EC4899',
    'Utilities': '#6B7280',
    'Travel': '#06B6D4',
    'Education': '#84CC16',
    'Other': '#64748B'
  };
  return colors[category] || colors['Other'];
};

export const getExpenseCategories = (): string[] => {
  return [
    'Food & Dining',
    'Transportation',
    'Groceries',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Utilities',
    'Travel',
    'Education',
    'Other'
  ];
};

export const extractReceiptData = (text: string): { amount?: number; description?: string; category?: string } => {
  const lines = text.toLowerCase().split('\n').filter(line => line.trim());
  
  // Try to extract amount
  const amountRegex = /[\$]?(\d+\.?\d*)/g;
  const amounts = [];
  let match;
  
  while ((match = amountRegex.exec(text)) !== null) {
    const amount = parseFloat(match[1]);
    if (amount > 0 && amount < 10000) { // Reasonable amount range
      amounts.push(amount);
    }
  }
  
  // Get the largest amount (likely the total)
  const amount = amounts.length > 0 ? Math.max(...amounts) : undefined;
  
  // Try to extract merchant/description
  const firstLine = lines[0] || '';
  const description = firstLine.charAt(0).toUpperCase() + firstLine.slice(1);
  
  // Simple category detection based on keywords
  const categoryKeywords = {
    'Food & Dining': ['restaurant', 'cafe', 'food', 'dine', 'pizza', 'burger'],
    'Groceries': ['grocery', 'market', 'store', 'supermarket'],
    'Transportation': ['gas', 'fuel', 'station', 'uber', 'taxi'],
    'Healthcare': ['pharmacy', 'medical', 'doctor', 'clinic'],
    'Shopping': ['shop', 'retail', 'mall', 'store']
  };
  
  let category = 'Other';
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      category = cat;
      break;
    }
  }
  
  return { amount, description: description || 'Receipt scan', category };
};