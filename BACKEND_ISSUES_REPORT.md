# Report Problemi Backend Collection Service

**Data**: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
**Backend URL**: https://collection.takeyourtrade.com/api/v1
**Status**: 🔴 CRITICO - Backend non funziona correttamente

---

## ❌ Problema Critico: JWKS Lookup Failed

### Errore
```
503 Service Unavailable
"Failed to fetch JWKS: [Errno -2] Name or service not known"
```

### Cosa Significa
Il backend **non riesce a validare i token JWT** perché non può raggiungere il servizio JWKS (JSON Web Key Set). 

Errore DNS: `Name or service not known` indica che:
- La JWKS URL è configurata male
- Il servizio auth non è raggiungibile
- Problema di risoluzione DNS

### Impatto
- ⚠️ Nessuna richiesta autenticata funziona
- ⚠️ Tutte le operazioni CRUD falliscono
- ⚠️ Il servizio è di fatto inutilizzabile

### Configurazione Attesa (Backend)
```python
# configurazione JWKS
JWKS_URL = "https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json"
# oppure
JWKS_URL = "https://auth.takeyourtrade.com/.well-known/jwks.json"

# Verifica che il servizio auth sia raggiungibile
import requests
response = requests.get(JWKS_URL)
print(response.json())
```

### Soluzione
1. **Verificare la JWKS URL** nel backend:
   ```bash
   # Test dal server backend
   curl https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json
   ```

2. **Verificare che il servizio auth sia raggiungibile** dal collection service
   - Controllare firewall
   - Verificare network policies
   - Controllare DNS resolution

3. **Testare localmente**:
   ```python
   import requests
   try:
       response = requests.get(JWKS_URL)
       print("JWKS OK:", response.json())
   except Exception as e:
       print("JWKS ERROR:", str(e))
   ```

---

## ⚠️ Problema: CORS Configuration

### Errore
```
405 Method Not Allowed su OPTIONS request
```

### Cosa Significa
Il backend **non supporta le richieste OPTIONS** (preflight CORS).

### Impatto
- ⚠️ I browser bloccano richieste cross-origin
- ⚠️ Frontend non può comunicare con backend
- ⚠️ Funziona solo con CORS estesi disabilitati (non consigliato)

### Configurazione Backend Richiesta
```python
# FastAPI / Starlette
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://takeyourtrade.com",
        "http://localhost:5173",  # dev
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Django
CORS_ALLOWED_ORIGINS = [
    "https://takeyourtrade.com",
]
CORS_ALLOW_METHODS = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = ['authorization', 'content-type']
```

### Soluzione
Aggiungere supporto per metodi OPTIONS nel backend.

---

## ⚠️ Problema: Health Endpoint Mancante

### Errore
```
404 Not Found su /health
```

### Cosa Significa
L'endpoint di health check **non esiste** o è in un percorso diverso.

### Impatto
- ⚠️ Monitoring non può verificare lo stato
- ⚠️ Load balancer non può fare health checks
- ⚠️ Difficile fare debugging

### Endpoints Attesi
```
GET /health
GET /api/v1/health
GET /healthcheck
GET /ping
```

### Soluzione Backend
```python
# FastAPI
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "collection"}

# Con test database
@app.get("/health")
async def health_check():
    try:
        # Test DB connection
        await database.execute("SELECT 1")
        return {"status": "ok", "database": "connected"}
    except:
        return {"status": "error", "database": "disconnected"}
```

---

## ✅ Cosa Funziona

1. **Connessione**: Il servizio risponde (non è offline)
2. **Velocità**: Buona (71ms response time)
3. **Validazione**: Riconosce richieste non autenticate (422 invece di 401)

---

## 📋 Checklist per Backend Team

- [ ] **Fixare JWKS URL** - Critical
  - Verificare URL configurazione
  - Testare accesso dal collection service al auth service
  - Verificare DNS resolution
  
- [ ] **Implementare CORS OPTIONS**
  - Supporto per richieste preflight
  - Configurare origins permessi
  
- [ ] **Aggiungere Health Endpoint**
  - Implementare `/health` o `/api/v1/health`
  - Includere check database e servizi esterni
  
- [ ] **Testare End-to-End**
  - Test con token JWT valido
  - Test da frontend cross-origin
  - Verificare tutti i metodi HTTP

---

## 🧪 Test da Eseguire sul Backend

### 1. Test JWKS
```bash
# Dal container/servizio collection
curl https://enter.takeyourtrade.com/api/auth/.well-known/jwks.json
# O qualunque sia la JWKS URL configurata
```

### 2. Test CORS
```bash
# Preflight request
curl -X OPTIONS https://collection.takeyourtrade.com/api/v1/collections/items/ \
  -H "Origin: https://takeyourtrade.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

### 3. Test Health
```bash
curl https://collection.takeyourtrade.com/api/v1/health
curl https://collection.takeyourtrade.com/health
```

### 4. Test con Token (dopo fix JWKS)
```bash
curl -X GET https://collection.takeyourtrade.com/api/v1/collections/items/ \
  -H "Authorization: Bearer TOKEN_QUI" \
  -H "Accept: application/json"
```

---

## 📞 Contatto

**Frontend Team**: Issue riportato
**Backend Team**: [Nome Team Backend]
**DevOps Team**: [Nome Team DevOps]

**File di Test**: `test-collection-backend.html` nel repo frontend

---

## 🎯 Priorità

1. **CRITICA** - Fixare JWKS (fa fallire tutte le richieste autenticate)
2. **ALTA** - Implementare CORS OPTIONS (blocca frontend)
3. **MEDIA** - Aggiungere health endpoint (utile per monitoring)

