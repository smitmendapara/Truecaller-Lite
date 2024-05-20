# API Documentation for Authenticate Assessment

## Base URL
https://authenticate-assessment.onrender.com/api

## API Endpoints

### 1. Sign Up
**Endpoint:** `/user/sign-up`  
**Method:** POST  
**Payload:**
```json
{
  "phone": "8789364576",
  "password": "alr113",
  "email": "alr113@gmail.com",
  "name": "ali"
}
```

Description: Registers a new user with the provided phone number, password, email, and name.

### 2. Sign In
**Endpoint:** `/user/sign-in`  
**Method:** POST  
**Payload:**
```json
{
  "phone": "8789364576",
  "password": "alr113"
}
```

Description: Authenticates a user using their phone number and password.

### 3. Search User
**Endpoint:** `/user/search-user?search=9876543210&page=1`  
**Method:** GET

Description: Searches for a user by phone number and returns paginated results.

### 4. View Detail
**Endpoint:** `/user/view-detail?id=1&phone=6854089795`  
**Method:** GET

Description: Retrieves detailed information about a contact based on their ID and phone number.

### 5. Spam Phone
**Endpoint:** `/user/spam-phone`  
**Method:** POST  
**Payload:**
```json
{
  "phone": "7676543210"
}
```

Description: Marks a phone number as spam.

### 6. Import Contact
**Endpoint:** `/user/import-contact`  
**Method:** POST  
**Payload:**
```json
{
  "contacts": [
    {
     "phone": "9876543210",
      "email": "abc45@example.com",
      "name": "John 4528"
    },
    {
      "phone": "9743210987",
      "email": "def@example.com",
      "name": "Johe 2242"
    },
    {
      "phone": "5987654321",
      "email": "",
      "name": "423 Johnson"
    },
    {
      "phone": "5432109876",
      "email": "ghi@example.com",
      "name": "john Brown"
    },
    {
      "phone": "7676543210",
      "email": "jklbg@example.com",
      "name": "john Lee"
    }
  ]
}
```

Description: Imports a list of contacts.

Postman Configuration
Authentication
Place the Authenticate.json and Environment.json files in your Postman configuration.

1. Authenticate.json: Contains the api's information.
2. Environment.json: Includes environment-specific variables.

How to Use

1. Open Postman.
2. Import the Authenticate.json and Environment.json files.
3. Select the environment from the top-right dropdown.
4. Use the provided endpoints to interact with the API.
