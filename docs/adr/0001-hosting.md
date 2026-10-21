# ADR 0001: Host everything on one small VPS

- Status: Accepted
- Date: 2026-10-21

## Context

The loop needs: static files, an always-on ingest endpoint, durable storage, a weekly scheduled job and approval links. The owner wants no subscriptions and data on their own server. Traffic is small (50–500 visitors a day).

Options considered:

1. **One small VPS** running Node, a SQLite file and cron.
2. **One serverless function** plus hosted storage and a scheduler.

## Decision

One small VPS (owner's choice, asked 2026-10-21). Node 22+ serves the site and the API; storage is a local SQLite file (ADR 0002); cron runs the weekly report.

## Consequences

- One machine, one process, one data file: simple to reason about and back up.
- Data never leaves the owner's server; no per-request billing.
- The owner patches the OS and Node; a backup of the SQLite file is needed (later phase).
- No built-in scaling; fine at this traffic. Revisit if a site passes ~50k visitors a day.
