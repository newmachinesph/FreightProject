# TruckConnect Philippines

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![React](https://img.shields.io/badge/React-19-61dafb)

The Philippine freight platform connecting shippers, carriers, and warehouses. No middlemen, transparent pricing, instant payouts.

## Architecture

```
                         +-------------------+
                         |  truckconnect-web |
                         |   (Landing Site)  |
                         |    Port 3000      |
                         +--------+----------+
                                  |
                    +-------------+-------------+
                    |                           |
          +---------v---------+     +-----------v-----------+
          | truckconnect-auth |     |  truckconnect-app     |
          | (Auth & Portals)  |     |  (Marketplace)        |
          |   Port 3001       |     |   Port 3006           |
          +---------+---------+     +-----------------------+
                    |
       +------------+------------+------------+
       |                         |            |
+------v--------+   +----------v---+   +----v--------------+
| truckconnect- |   | truckconnect-|   | truckconnect-     |
|   shipper     |   |   carrier    |   |   warehouse       |
|  Port 3003    |   |  Port 3004   |   |  Port 3005        |
+---------------+   +--------------+   +-------------------+
```

## Services

| Service              | Port | Description                                              |
|----------------------|------|----------------------------------------------------------|
| `truckconnect-web`   | 3000 | Marketing/landing site with SEO-optimized pages           |
| `truckconnect-auth`  | 3001 | Authentication service with admin, org, and user portals  |
| `truckconnect-shipper` | 3003 | Shipper dashboard for booking and tracking shipments    |
| `truckconnect-carrier` | 3004 | Carrier dashboard for fleet, drivers, and job management |
| `truckconnect-warehouse` | 3005 | Warehouse management for inventory and facilities     |
| `truckconnect-app`   | 3006 | Freight marketplace for browsing and booking loads        |

### Supporting Packages

| Package            | Description                                    |
|--------------------|------------------------------------------------|
| `truckconnect-sdk` | Shared utilities, types, and API client library |

## Tech Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Inline styles with design tokens, Tailwind in the auth service
- **Icons:** Lucide React
- **Auth:** Better Auth with Drizzle ORM (truckconnect-auth)
- **Monorepo:** npm workspaces

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

The auth service needs environment variables such as `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (see `truckconnect-auth/lib`). Never commit a real `.env`.

### Run all services

```bash
# Start each service in a separate terminal
cd truckconnect-web   && npm run dev   # http://localhost:3000
cd truckconnect-auth  && npm run dev   # http://localhost:3001
cd truckconnect-shipper && npm run dev # http://localhost:3003
cd truckconnect-carrier && npm run dev # http://localhost:3004
cd truckconnect-warehouse && npm run dev # http://localhost:3005
cd truckconnect-app   && npm run dev   # http://localhost:3006
```

### Run a single service

```bash
npm run dev --workspace=truckconnect-web
```

## Testing

End-to-end tests use Playwright and live in `tests/`:

```bash
cd tests && npm install && npm run test:e2e
```

## Port Assignments

| Port | Service            |
|------|--------------------|
| 3000 | Web (landing site) |
| 3001 | Auth               |
| 3003 | Shipper portal     |
| 3004 | Carrier portal     |
| 3005 | Warehouse portal   |
| 3006 | Marketplace        |

## Project Structure

```
FreightProject/
  truckconnect-web/        # Public marketing site
  truckconnect-auth/       # Authentication & portal routing
  truckconnect-shipper/    # Shipper dashboard
  truckconnect-carrier/    # Carrier dashboard
  truckconnect-warehouse/  # Warehouse dashboard
  truckconnect-app/        # Freight marketplace
  truckconnect-sdk/        # Shared SDK & utilities
  tests/                   # Integration & E2E tests
  docs/                    # Documentation
```

## License

[MIT](LICENSE)

