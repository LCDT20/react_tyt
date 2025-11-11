# Collection Feature - 503 Error Troubleshooting

## Problem
You're seeing a 503 (Service Unavailable) error when trying to access the collection feature.

## Error Message
User sees: "Il servizio di collezione non è disponibile al momento. Riprova più tardi."

## Possible Causes

### 1. Backend Service Not Running
The Collection Service backend at `https://collection.takeyourtrade.com` is not running or is down.

**Solution:**
- Check if the backend service is deployed and running
- Verify the service health endpoint: `https://collection.takeyourtrade.com/api/v1/health`
- Contact the backend team to restart/repair the service

### 2. CORS Configuration
The backend might not be configured to accept requests from the frontend domain.

**Solution:**
- Verify CORS settings on the backend
- Ensure `https://takeyourtrade.com` (or your frontend domain) is in the allowed origins list
- Check if preflight OPTIONS requests are being handled correctly

### 3. Network Issues
Temporary network connectivity issues between frontend and backend.

**Solution:**
- Wait a few minutes and try again
- Check your internet connection
- Verify DNS resolution for `collection.takeyourtrade.com`

### 4. Firewall/Security Rules
Security rules or firewall might be blocking the connection.

**Solution:**
- Check if the backend IP/domain is whitelisted
- Verify security groups/ACLs are properly configured
- Contact your infrastructure team

### 5. SSL/TLS Certificate Issues
Certificate problems preventing the connection.

**Solution:**
- Verify the SSL certificate is valid and not expired
- Check if the certificate matches the domain name
- Ensure intermediate certificates are properly configured

## How the Frontend Handles It

The frontend has been updated to:
1. **Detect 503 errors** in the HTTP response interceptor
2. **Display user-friendly message** in Italian
3. **Log detailed error** to browser console for debugging
4. **Allow users to dismiss** the error message

## Debugging Steps

### In Browser Console
When a 503 error occurs, you'll see:
```
🔴 Service Unavailable: Collection Service is not responding
```

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load the collection page
4. Look for the failed request to `collection.takeyourtrade.com`
5. Check the status code and response body

### Test Backend Health
Open this URL in your browser:
```
https://collection.takeyourtrade.com/api/v1/health
```

Expected response if healthy:
```json
{
  "status": "ok"
}
```

If you get 503 or connection error, the backend is down.

## Temporary Workaround

While the service is down, users will see:
- Error message at the top of the collection page
- No data in the table
- All actions (add/edit/delete) will fail with the same error

Users can still:
- Dismiss the error message
- Navigate to other parts of the app
- Come back later when the service is restored

## Monitoring

To monitor the service health:
1. Set up uptime monitoring for the health endpoint
2. Configure alerts for 503 errors
3. Monitor error rates in your analytics

## Next Steps

Once the backend is restored:
1. Users can refresh the page
2. The collection will load normally
3. All CRUD operations will work again

No changes needed in the frontend code.

