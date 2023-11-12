# Authrex Node
An authentication as a service provider made using express and postgresql. This project aims to showcase my skills in backend development.

# Project Planning
- [ ] `/signup`
for signing up a new user or a new client
- [ ] `/login`
for logging in a user or a client
- [ ] `/options`
for getting the login options of a specified user
- [ ] `/redirect`
fetches the redirect url of the specified user

# Design Decisions
1. Using postgresql as the database
2. Using express as the server
3. Using JSDocs for type inference
4. Using ESLint for code formatting
5. Using Jest for unit testing

---

`/signup?type={user,client}` has two types of users: `user` and `client`. A user is a person who wants to use the product as a service. A client is a person who uses the user's service. For example, a user can be a company and clients can be the users of the company.

Implementing user type first since the project starts with a user signing up. Signing up shuold create a new user, and returns a jwt token with the user's id and user's type.

Storing hashed passwords instead of plain text, this increases security. I have also salted every passwords before hashing to prevent any rainbow table attacks.  