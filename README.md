# Setting up TravelBug

Below are the instructions to setup TravelBug locally.

## Prerequisites

Node.js, npm must be installed on the system.

## Cloning the Repository

```bash
git clone https://github.com/chiranjeevsehgal/TravelBug.git
cd TravelBug
```

## Backend Configuration

**Environment File**: Navigate to the `backend` folder and create `.env` file. Add the following content to the file:

    #MongoDB Variables
    MONGO_URL = 
    DB_NAME = 
    
    #JWT Variable
    JWT_SECRET = 

    # Braintree Payment Variables
    BRAINTREE_MERCHANT_ID = 
    BRAINTREE_PUBLIC_KEY = 
    BRAINTREE_PRIVATE_KEY =

    #Resend Variable 
    RESEND_API_KEY= 

 - Create accounts at MongoDB, Paypal Braintree and Resend to setup the keys. `JWT_SECRET` can be any secret or randomly generated key.  
  

## Frontend Configuration

**Environment File**: Navigate to the `client` folder and create a file: `.env`:
    
    # Firebase Variables
    VITE_FIREBASE_API_KEY = 
    VITE_FIREBASE_authDomain = 
    VITE_FIREBASE_projectId = 
    VITE_FIREBASE_storageBucket = 
    VITE_FIREBASE_messagingSenderId = 
    VITE_FIREBASE_appId = 
    
    # Gemini API Key
    VITE_API_GENERATIVE_LANGUAGE_CLIENT = 
    
    # URL where backend application is running
    VITE_API_BASE_URL=

    
- The `VITE_API_BASE_URL` should point to the URL where the backend application is running.

## Running the Application

1. **Backend**:
    - Navigate to the `backend` directory.
    - Install dependencies: `npm install`.
    - Start the server: `npm run dev`.

2. **Frontend**:
    - Open a new terminal and navigate to the `client` directory.
    - Install dependencies: `npm install`.
    - Start the frontend application: `npm run dev`.
    - The application should now be running on `http://localhost:5173`.