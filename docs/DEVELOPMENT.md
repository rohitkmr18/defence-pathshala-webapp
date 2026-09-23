\# Defence Pathshala PYQ Intelligence — Development Guide



\## Project Status



The repository is currently being migrated from the original Streamlit prototype

to the production architecture.



\## Architecture



The target architecture is:



Browser

→ Next.js / React / TypeScript

→ FastAPI / Python

→ PostgreSQL / Supabase



Supporting services:



\- Supabase Auth

\- PostgreSQL Row Level Security

\- Background workers

\- AI provider adapters

\- Product analytics

\- Application monitoring



\## Legacy Prototype



`dashboard.py` is the existing Streamlit implementation.



It is intentionally preserved during the migration and acts as a reference

implementation for validating business logic and user workflows.



It should not be destructively rewritten during the initial migration.



\## Development Principles



1\. Preserve validated educational/product logic.

2\. Move durable state from Streamlit session state into the backend/database.

3\. Keep correctness and scoring deterministic.

4\. Keep AI features isolated from the core assessment flow.

5\. Never commit secrets.

6\. Use database migrations for schema changes.

7\. Add tests for changed business behaviour.

8\. Prefer measured performance improvements over premature infrastructure.

