# Personal Loan Application

This project is a personal loan application, where the user can create account, request for loans, check the status of the loan and also pay the loan partially or totally.

It was used a scalable architecture using cache, rate-limiting, monitoring tools and advanced security strategies, using 4 services.

Express(Typescript), Redis, PostgreSQL, Prometheus

---

### 1. Start the Project with Docker
Run the following command to build and start the containers:
(If you dont want to run seed data, you can remove the seed command from the Dockerfile, basically removing "&& npm run db:seed " it will work)


```bash
docker-compose up --build
```
This will start:

- The express-server on port 8080
- The postgres database on port 5432
- The redis server on port 6379
- The prometheus server on port 9090

### 2. Access the Services
Express Server: http://localhost:8080

Prometheus: http://localhost:9090

### 3. Run Tests
To run tests locally (optional), you can execute:

```bash
npm install
npm run test
```

## Seeds  
The project includes a seed file that initializes a test user and a test loan, allowing you to quickly test the application without manually creating them.  

### Test Credentials  

#### User Account  
```bash
Email: user@mail.com  
Password: 123456  
```

#### Admin Account  
```bash
Email: admin@mail.com  
Password: 123456  
```

The PATCH endpoint to approve or reject loan is protected by admin role, so you have to use the admin credentials to approve or reject the loan.

## API Documentation

You can access the Swagger API documentation at the following URL:

  ```bash
    /api-docs
  ```

## Monitoring

You can access the Prometheus monitoring at the following URL:

  ```bash
    /metrics
  ```

## Postman Collection

You can access the project's Postman collection using the following link:

[View Postman Collection](https://universal-station-318821.postman.co/workspace/Code2~0f456f8a-7eef-447b-83d0-baba313d8d66/collection/23743628-07fb15e6-b14f-47c6-95d1-7f942525ca63?action=share&creator=23743628)

## Authentication
This project uses JWT (JSON Web Token) for authentication. To enhance security, the JWT expires after 7 hours. When the token expires, you can use a **refresh token** to obtain a new JWT, allowing you to avoid re-authenticating every time the token expires.

## Rate Limiter

This project implements a **Rate Limiter** to prevent abuse and ensure fair use of the application's resources. The rate limiter is based on the user's IP address and limits the number of requests each IP can make.

### How it works:
- Each IP can make **only 5 requests per minute**.
- The rate limiter is implemented using **Redis**, which stores and tracks the number of requests for each IP address.
- If an IP exceeds the request limit within the given time window, further requests will be blocked with a `429 Too Many Requests` response.
- Redis' **TTL (Time-to-Live)** functionality automatically resets the request counter every minute, allowing the user to make new requests.

This ensures that the application is protected from excessive requests and remains performant even under heavy traffic.

## Assumptions
- The user can have more than one loan at a time.
- The user can pay the loan partially or totally, regardless the duration.

## Improvements to be made
- Add a grafana to vizualize the metrics from prometheus.
- I would add a new status to loan, like "paid", so we can track the loans that are already paid, instead of checking remaining_balance.
- I would change the money fields to integer, so we can avoid floating point problems.
- I would use redis (with expiration) to store the tokens that was revoked (it happens when user ask to renew tokens), so we can check if the token is valid or not.
- If necessary, I would add user_id to the payment table, so we can track the payments made by each user, regardless the relation with loan.
- If necessary I would some add in loan approval some calculation to add fees to the payments