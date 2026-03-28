# Demo 5 — Terminal & Breakage Exercises

Run these with Demo 2's server already running (`cd 02-http-server && node server.js`).

## curl Commands (show that browser is just one client)

```bash
# Read all users
curl http://localhost:3000/api/users

# Add a user from terminal
curl -X PUT http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Ana\",\"city\":\"Cluj\"}"

# Delete first user
curl -X DELETE http://localhost:3000/api/users/0

# Test slow endpoint
curl http://localhost:3000/api/slow?ms=3000
```

Refresh the browser after each curl command — the data changed without the browser doing anything!

## Break It Exercises (for students to diagnose)

### 1. Stop the server
- Stop the Node process (Ctrl+C)
- Click "Add User" in the browser
- **What happens?** → Network error, ECONNREFUSED
- **Lesson:** The client depends on the server being alive

### 2. Wrong port
- Change the browser URL to `http://localhost:3001`
- **What happens?** → Connection refused (nothing running there)
- **Lesson:** IP + Port = the full address

### 3. Wrong HTTP method
```bash
curl -X PATCH http://localhost:3000/api/users
```
- **What happens?** → 404, method not implemented
- **Lesson:** The server defines which methods it accepts

### 4. Bad JSON
```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "not json"
```
- **What happens?** → 400 parse error
- **Lesson:** Both sides must agree on data format
