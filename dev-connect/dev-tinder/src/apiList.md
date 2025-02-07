**_DevConnect APIs_**

## AUTH ROUTER

-POST /signup
-POST /Login
-POST /logout

## PROFILE ROUTER

-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

## CONNECTION REQUEST ROUTER

-POST /request/send/:status/:userId --> status = [interested, ignored]

-POST /request/review/:status/:requestId --> status = [Accepted, rejected]

## User ROUTER

-GET /user/requests/received
-GET /user/connections
-GET /user/feed - Gets you the profile of others user on platform

STATUS: ignore, interest, accepted, rejected
