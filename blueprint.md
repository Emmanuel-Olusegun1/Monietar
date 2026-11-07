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
- New email signups trigger a branded welcome email through Resend; email delivery
  failures do not undo a successful account signup.
- The Supabase Auth profile trigger handles duplicate emails in `public.users`
  without aborting Auth signup.
- Authentication pages show inline feedback and navigate immediately after success.
- Dashboard sign-out requires confirmation.
- Sign-out confirmations use an accessible in-app modal with cancel and confirm actions.
- Bank account connection, synchronization, disconnection, and statement imports
  derive ownership from the authenticated session.
- Settings can open Mono Connect, save the authorized account, sync its transactions,
  refresh connection details, and disconnect the account. Disconnecting soft-deletes
  the connection locally so historical transactions remain available.
- `user_accounts` is the source of truth for active bank connections; active and
  connected records count as connected, while disconnected records do not.
- Signup stores the requested business name in Auth metadata; the bank connection
  endpoint provisions the primary `businesses` row when one does not yet exist.
- Server-side bank synchronization enforces monthly automatic transaction limits.
- The admin workspace uses Monietar's light editorial dashboard styling across
  its access gate, navigation, metrics, tables, support panels, flags, audit
  log, and system-health views.
- Admin metrics cover users, businesses, transactions, budgets, accounts, bank
  connections, sales, products, cash vaults, contact messages, and waitlist
  activity, with dedicated product-usage and banking-operations views.

## Completed change plan

1. Enforced connected-bank and automatic-transaction plan limits on server APIs.
2. Removed trust in client-supplied user IDs for account and statement operations.
3. Added confirmation before dashboard sign-out actions.
4. Validated the changes with TypeScript and repository diff checks.
