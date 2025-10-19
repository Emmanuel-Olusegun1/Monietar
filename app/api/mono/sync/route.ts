// Add this function to debug API calls
const debugAPI = async (url: string, options: any) => {
  console.log(`API Call: ${url}`, options);
  try {
    const response = await fetch(url, options);
    console.log(`API Response: ${url}`, response.status, response.statusText);
    const result = await response.json();
    console.log(`API Result: ${url}`, result);
    return { response, result };
  } catch (error) {
    console.error(`API Error: ${url}`, error);
    throw error;
  }
};

// Update your handler functions:

// Handle Mono connection success
const handleMonoSuccess = async (authCode: string) => {
  if (!session) return;

  try {
    console.log('Mono auth code received:', authCode);
    
    const { response, result } = await debugAPI('/api/mono/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: authCode,
        userId: session.user.id,
      }),
    });

    if (response.ok) {
      showToast('Bank account connected successfully!');
      setShowMonoConnect(false);
      await fetchConnectedAccounts();
      
      // Trigger initial sync
      if (result.accountId) {
        await syncAccountTransactions(result.accountId);
      }
    } else {
      showToast(result.error || 'Failed to connect bank account');
    }
  } catch (error) {
    console.error('Mono connection error:', error);
    showToast('Error connecting bank account');
  }
};

// Sync account transactions
const syncAccountTransactions = async (accountId: string) => {
  setSyncingAccounts(prev => [...prev, accountId]);
  
  try {
    const { response, result } = await debugAPI('/api/mono/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId,
        userId: session.user.id,
      }),
    });

    if (response.ok) {
      showToast('Account synced successfully!');
      await fetchConnectedAccounts();
    } else {
      showToast(result.error || 'Failed to sync account');
    }
  } catch (error) {
    console.error('Sync error:', error);
    showToast('Error syncing account');
  } finally {
    setSyncingAccounts(prev => prev.filter(id => id !== accountId));
  }
};

// Disconnect account
const handleDisconnectAccount = async (accountId: string, monoAccountId: string) => {
  if (!confirm('Are you sure you want to disconnect this account? This will stop automatic transaction updates.')) {
    return;
  }

  try {
    const { response, result } = await debugAPI('/api/mono/disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        accountId,
        monoAccountId,
        userId: session.user.id 
      }),
    });

    if (response.ok) {
      showToast('Account disconnected successfully');
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } else {
      showToast(result.error || 'Failed to disconnect account');
    }
  } catch (error) {
    console.error('Disconnect error:', error);
    showToast('Error disconnecting account');
  }
};