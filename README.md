**Signup Admin**:
Method: POST,
Url:  http://localhost:3000/api/user/register/admin

**Add Client by Admin**:
Method: POST,
Token needed, 
Url:  http://localhost:3000/api/user/register

**Login**:
Method: POST,
Url:  http://localhost:3000/api/user/login

**Add Router**:
Method: POST,
Token needed, 
Url: http://localhost:3000/api/router/add-router

**Get Router of a user**:
Method: GET,
Token needed, 
Url: http://localhost:3000/api/router

**Delete a router:**
Method: DELETE,
Token needed, 
Url: http://localhost:3000/api/router/id    
Replace id with actual router id

**Add Voucher to Router:**
Method: PATCH,
Token needed, 
Url: http://localhost:3000/api/router/voucher/<routerID>  
Replace <routerID> with actual router id
