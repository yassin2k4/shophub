# ShopHub

ShopHub is a MERN storefront with a React client, Express API, MongoDB persistence, JWT authentication, and a role-protected admin catalog.

## Run locally

1. Install Node.js and MongoDB, then start MongoDB locally.
2. Copy `.env.example` to `.env` and set a private `JWT_SECRET`. Keep the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values for the first admin account.
3. Install dependencies with `npm install`.
4. Start the API and React client with `npm run dev`.

The storefront runs at `http://localhost:3000` and the API runs at `http://localhost:5000`. On the first API start, the admin account from `.env` is created or promoted automatically. Sign in with it to see the Admin tab and add products.

If MongoDB is not running, the client uses demo products for browsing, but accounts and admin product changes require the API and MongoDB to be available.

## API routes

- `POST /api/auth/signup` and `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (admin JWT required)
- `DELETE /api/products/:id` (admin JWT required)