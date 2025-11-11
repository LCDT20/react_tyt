# Guida di Fix per Backend Collection Service

## 🔴 Problema #1: JWKS Lookup Failed (CRITICO)

### Errore
```
Failed to fetch JWKS: [Errno -2] Name or service not known
```

### Diagnostica
Il servizio non riesce a risolvere il DNS per la JWKS URL.

### Fix per FastAPI

```python
# main.py o app.py

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional

app = FastAPI()

# Verifica JWKS URL (dovrebbe essere nel .env)
JWKS_URL = os.getenv("JWKS_URL", "https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json")

# Cache per le chiavi
jwks_cache = {}
jwks_cache_time = None
CACHE_DURATION = 3600  # 1 ora

async def get_jwks_keys():
    """Ottiene le chiavi JWKS con caching"""
    global jwks_cache, jwks_cache_time
    
    # Usa cache se valida
    if jwks_cache_time and (time.time() - jwks_cache_time) < CACHE_DURATION:
        return jwks_cache
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(JWKS_URL)
            response.raise_for_status()
            
            jwks = response.json()
            jwks_cache = jwks
            jwks_cache_time = time.time()
            
            return jwks
    except httpx.TimeoutException:
        print(f"⚠️ JWKS Timeout: {JWKS_URL}")
        # Fallback: usa cache scaduta se disponibile
        if jwks_cache:
            print("⚠️ Usando cache JWKS scaduta")
            return jwks_cache
        raise HTTPException(status_code=503, detail="Unable to fetch JWKS")
    except Exception as e:
        print(f"❌ JWKS Error: {e}")
        # Fallback: usa cache scaduta se disponibile
        if jwks_cache:
            print("⚠️ Usando cache JWKS scaduta")
            return jwks_cache
        raise HTTPException(status_code=503, detail=f"Failed to fetch JWKS: {str(e)}")

async def verify_token(token: str):
    """Verifica il token JWT"""
    try:
        # Ottieni header del token
        unverified_header = jwt.get_unverified_header(token)
        
        # Ottieni JWKS
        jwks = await get_jwks_keys()
        
        # Trova la chiave corretta
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        
        if not rsa_key:
            raise HTTPException(status_code=401, detail="Unable to find appropriate key")
        
        # Decodifica e verifica token
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key)
        
        # Verifica
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=os.getenv("JWT_AUDIENCE", "takeyourtrade"),
            issuer=os.getenv("JWT_ISSUER", "https://enter.takeyourtrade.com")
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token verification error: {str(e)}")

# Middleware di autenticazione
security = HTTPBearer()

@app.middleware("http")
async def authenticate_middleware(request: Request, call_next):
    # Skip auth per health endpoint
    if request.url.path in ["/health", "/api/v1/health"]:
        return await call_next(request)
    
    # Verifica Bearer token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=422,
            detail=[{
                "type": "missing",
                "loc": ["header", "authorization"],
                "msg": "Field required",
            }]
        )
    
    token = auth_header.split(" ")[1]
    try:
        payload = await verify_token(token)
        # Aggiungi payload al request state
        request.state.user_id = payload.get("sub") or payload.get("user_id")
        return await call_next(request)
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Auth Error: {e}")
        raise HTTPException(status_code=503, detail="Authentication service unavailable")
```

### Test Locale
```bash
# Test JWKS URL
curl https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json

# Se non risponde, verifica:
# 1. Il servizio auth è raggiungibile?
# 2. La URL è corretta?
# 3. DNS risolve correttamente?
```

### Alternative: Usa Service Mesh o Config Interno
Se il servizio auth non è raggiungibile via HTTP, considera:

```python
# Opzione 1: File JWKS locale
JWKS_PATH = "/app/.well-known/jwks.json"

async def get_jwks_keys():
    if os.path.exists(JWKS_PATH):
        with open(JWKS_PATH, 'r') as f:
            return json.load(f)
    # Fallback a HTTP
    return await fetch_jwks_http()

# Opzione 2: Configurazione diretta chiavi
JWT_PUBLIC_KEY = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCA...
-----END PUBLIC KEY-----"""

async def verify_token(token):
    return jwt.decode(
        token,
        JWT_PUBLIC_KEY,
        algorithms=["RS256"]
    )
```

---

## ⚠️ Problema #2: CORS OPTIONS Not Supported

### Fix per FastAPI

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Aggiungi CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://takeyourtrade.com",
        "https://www.takeyourtrade.com",
        "http://localhost:5173",  # dev
        "http://localhost:3000",  # dev alternativo
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "X-Requested-With",
    ],
    expose_headers=["X-Total-Count", "X-Page-Count"],
    max_age=86400,  # 24 ore
)
```

### Fix per Django

```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Deve essere sopra tutti
    ...
]

CORS_ALLOWED_ORIGINS = [
    "https://takeyourtrade.com",
    "https://www.takeyourtrade.com",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PATCH',
    'DELETE',
    'PUT',
    'OPTIONS',
]
CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'accept',
]

# Gestione manuale OPTIONS se necessario
from django.http import JsonResponse

def options_handler(request):
    response = JsonResponse({})
    response["Access-Control-Allow-Origin"] = "https://takeyourtrade.com"
    response["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    response["Access-Control-Max-Age"] = "86400"
    return response
```

### Test CORS
```bash
# Preflight request
curl -X OPTIONS https://collection.takeyourtrade.com/api/v1/collections/items/ \
  -H "Origin: https://takeyourtrade.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v

# Dovresti vedere:
# < HTTP/1.1 200 OK
# < Access-Control-Allow-Origin: https://takeyourtrade.com
# < Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
# < Access-Control-Allow-Headers: Authorization, Content-Type
```

---

## ⚠️ Problema #3: Health Endpoint Mancante

### Fix per FastAPI

```python
@app.get("/health")
@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    status = {
        "status": "ok",
        "service": "collection",
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    # Check database
    try:
        await database.execute("SELECT 1")
        status["database"] = "connected"
    except Exception as e:
        status["database"] = "disconnected"
        status["database_error"] = str(e)
    
    # Check auth service (JWKS)
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(JWKS_URL)
            status["auth_service"] = "reachable" if response.status_code == 200 else "unreachable"
    except:
        status["auth_service"] = "unreachable"
    
    # Return status code based on health
    status_code = 200 if status["database"] == "connected" else 503
    
    return Response(
        content=json.dumps(status),
        media_type="application/json",
        status_code=status_code
    )
```

### Fix per Django

```python
# views.py
from django.http import JsonResponse
from django.db import connection
import httpx

def health_check(request):
    """Health check endpoint"""
    status = {
        "status": "ok",
        "service": "collection",
    }
    
    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        status["database"] = "connected"
    except Exception as e:
        status["database"] = "disconnected"
        status["database_error"] = str(e)
    
    # Check auth service
    try:
        response = httpx.get(JWKS_URL, timeout=5.0)
        status["auth_service"] = "reachable" if response.status_code == 200 else "unreachable"
    except:
        status["auth_service"] = "unreachable"
    
    status_code = 200 if status["database"] == "connected" else 503
    
    return JsonResponse(status, status=status_code)

# urls.py
urlpatterns = [
    path('health', health_check),
    path('api/v1/health', health_check),
    ...
]
```

### Test Health
```bash
curl https://collection.takeyourtrade.com/api/v1/health

# Risposta attesa:
# {
#   "status": "ok",
#   "service": "collection",
#   "database": "connected",
#   "auth_service": "reachable"
# }
```

---

## 🔧 Configurazione Environment Variables

Aggiungi al `.env` o configurazione container:

```env
# JWKS Configuration
JWKS_URL=https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json
JWT_ISSUER=https://enter.takeyourtrade.com
JWT_AUDIENCE=takeyourtrade

# CORS Configuration
CORS_ORIGINS=https://takeyourtrade.com,https://www.takeyourtrade.com
CORS_DEV_ORIGINS=http://localhost:5173,http://localhost:3000

# Timeout Settings
JWKS_CACHE_DURATION=3600
AUTH_TIMEOUT=10

# Alternative JWKS (fallback)
JWKS_FALLBACK_URL=https://auth.takeyourtrade.com/.well-known/jwks.json
```

---

## 📝 Checklist Deployment

- [ ] Verificare che JWKS_URL sia raggiungibile dal container
- [ ] Testare resolution DNS nel container
- [ ] Verificare firewall/network policies
- [ ] Testare CORS preflight requests
- [ ] Verificare health endpoint
- [ ] Testare con token JWT valido end-to-end
- [ ] Verificare logging degli errori
- [ ] Configurare monitoring su health endpoint

---

## 🐛 Debug Commands

```bash
# Dentro il container del collection service
python -c "
import requests
import os

jwks_url = os.getenv('JWKS_URL')
print(f'JWKS URL: {jwks_url}')

try:
    response = requests.get(jwks_url, timeout=10)
    print(f'Status: {response.status_code}')
    print(f'Response: {response.json()}')
except Exception as e:
    print(f'Error: {e}')
"

# Test DNS resolution
nslookup enter.takeyourtrade.com

# Test connectivity
curl -v https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json
```

---

## ✅ Testing After Fix

Eseguire tutti i test dal file `test-collection-backend.html`:

1. Health endpoint deve rispondere 200
2. CORS preflight deve rispondere 200 con headers corretti
3. Autenticazione con token deve funzionare
4. CRUD operations devono funzionare
5. Non devono esserci errori 503 per JWKS

