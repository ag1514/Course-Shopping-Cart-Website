# CloudProject_ms

A Next.js web application built with Tailwind CSS and NextAuth.js for authentication.

## Features

- Server-side rendering with Next.js
- Authentication using NextAuth.js (Google or other providers)
- Tailwind CSS for styling
- Role-based access control (e.g., agent role)
- Responsive UI

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- (Optional) Docker, if you want to run via Docker

### Installation

1. Clone the repository
git clone https://github.com/ag1514/Course-Shopping-Cart-Website.git cd CloudProject_ms

2. Install dependencies
npm install
or
yarn install

3. Set up environment variables:
   
  Create a file named .env.local in the root folder and add:
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  NEXTAUTH_URL=http://localhost:3000

4. Run the development server
npm run dev
or
yarn dev

5. Open in browser:
Visit http://localhost:3000
