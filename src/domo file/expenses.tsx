import { getDoc } from 'firebase/firestore';

const expensesRefs = data.expenses; // array of DocumentReferences
const expenses = [];

for (const ref of expensesRefs) {
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    expenses.push({ id: docSnap.id, ...docSnap.data() });
  }
}

// Then optionally: setExpenses(expenses);
