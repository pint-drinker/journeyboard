# JourneyBoard

JourneyBoard is a powerful tool designed to help you map out processes and user journeys, add insights, and automatically associate those insights with different steps within those process maps. It provides a comprehensive platform for visualizing and optimizing workflows, making it an essential tool for project managers, UX designers, and business analysts.

## Getting Started

To get started with JourneyBoard, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

Setup your environment variables by copying the `.env.example` file to `.env` and setting the appropriate values. You will need to create a new project in [Convex](https://www.convex.dev/) and set the `VITE_CONVEX_URL` environment variable to the URL of your Convex deployment. 

This project uses OAuth with Github via Convex Auth. If you want to use a different provider, you will need to update the `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` environment variables. For more information, refer to the [Convex Auth documentation](https://docs.convex.dev/auth).

### Technologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Convex](https://www.convex.dev/)
- [Vite](https://vitejs.dev/)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/journeyboard.git
   cd journeyboard
   ```

2. **Install Dependencies:**

   Use npm to install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Run the Application:**

   Start the development server:

   ```bash
   npm run dev
   ```

   In another terminal, start the Convex dev server:

   ```bash
   npx convex dev
   ```

   This will start the application and you can view it in your browser at `http://localhost:5173`.

### Deploying

This project is deployed to Vercel. To deploy your own copy, fork this repository and create a new project on Vercel. Then, update the `VITE_CONVEX_URL` environment variable with the URL of your Convex deployment. Follow additional instructions in the [Vercel deployment guide](https://vercel.com/docs/deployments/manual-deploys).

### Features

- **Process Mapping:** Create detailed maps of your processes and user journeys.
- **Insight Integration:** Add insights directly to your process maps and automatically associate them with relevant steps.
- **User-Friendly Interface:** Navigate and manage your projects with an intuitive and easy-to-use interface.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

For more information, visit our [documentation](https://journeyboard-docs.example.com).
