# Monietar Blueprint

## Overview

Monietar is a merchant finance dashboard with authentication, transaction tracking,
bank statement imports, connected bank accounts, cash vaults, sales, inventory,
reports, and plan-based feature access.

## Current functionality

- Retail Starter includes one connected bank account, 30 automatic bank transactions
  per month, unlimited statement imports and manual entries, basic reporting,
  one cash vault, and basic sales/product management.
- Premium features include additional bank accounts, higher automatic transaction
  limits, analytics, dual currency, automated inventory, alerts, AI CFO, and exports.
- Contact submissions send branded two-way email notifications.
- Authentication pages show inline feedback and navigate immediately after success.
- Dashboard sign-out requires confirmation.
- Sign-out confirmations use an accessible in-app modal with cancel and confirm actions.
- Bank account connection, synchronization, disconnection, and statement imports
  derive ownership from the authenticated session.
- Settings can open Mono Connect, save the authorized account, sync its transactions,
  refresh connection details, and disconnect the account.
- Server-side bank synchronization enforces monthly automatic transaction limits.

## Completed change plan

1. Enforced connected-bank and automatic-transaction plan limits on server APIs.
2. Removed trust in client-supplied user IDs for account and statement operations.
3. Added confirmation before dashboard sign-out actions.
4. Validated the changes with TypeScript and repository diff checks.
