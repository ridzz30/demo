# usermanagement

Crud api for user management

## API details

POST http://localhost:3000/api/users
Content-Type: application/json

{
"username": "newuser",
"password": "newpassword"
}

POST http://localhost:3000/api/login
Content-Type: application/json

{
"username": "newuser",
"password": "newpassword"
}

GET http://localhost:3000/api/protected
Authorization: Bearer your-generated-jwt-token

PUT http://localhost:3000/api/users/user_id_here
Content-Type: application/json
Authorization: Bearer your-generated-jwt-token

{
"password": "newpassword123"
}

DELETE http://localhost:3000/api/users/user_id_here
Authorization: Bearer your-generated-jwt-token
