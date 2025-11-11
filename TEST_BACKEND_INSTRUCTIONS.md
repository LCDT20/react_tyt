# Test Backend Collection Service - Istruzioni

## Come Usare il Test

### 1. Aprire il File
Apri il file `test-collection-backend.html` nel tuo browser.

### 2. Configurare il Token (Opzionale)
- Il token viene caricato automaticamente da localStorage se disponibile
- Oppure incolla manualmente un token JWT valido
- Clicca "Carica Token da LocalStorage" per caricarlo

### 3. Eseguire i Test

#### Test Singoli
Clicca sui pulsanti individuali per testare specifici aspetti:
- **Test GET /collections/items/** - Verifica la connessione base
- **Test GET /health** - Verifica lo stato del servizio
- **Test OPTIONS Request** - Verifica CORS
- **Test con Token JWT** - Testa l'autenticazione
- **Test POST** - Prova a creare un item
- **Test con Filtri** - Testa i parametri di query
- **Test Timeout** - Verifica che risponda entro 30 secondi

#### Tutti i Test
Clicca "▶️ Esegui Tutti i Test" per eseguire tutti i test in sequenza.

### 4. Interpretare i Risultati

#### ✅ Successo (Verde)
- Connessione OK
- Risposta ricevuta correttamente
- Status 200-299

#### ⚠️ Warning (Giallo)
- Risposta ricevuta ma con avvertimenti
- Status 300-399
- Manco di alcune configurazioni

#### ❌ Errore (Rosso)
- Connessione fallita
- Errore 4xx o 5xx
- Timeout

## Problemi Comuni

### 503 Service Unavailable
**Causa**: Il backend non è in esecuzione
**Soluzione**: 
- Verifica che il servizio sia deployato
- Controlla i log del backend
- Verifica la configurazione dell'hosting

### CORS Error
**Causa**: Il backend non accetta richieste dal tuo dominio
**Soluzione**:
```python
# Backend deve avere:
CORS_ORIGINS = ["https://takeyourtrade.com"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ["Authorization", "Content-Type"]
```

### 401 Unauthorized
**Causa**: Token JWT non valido o scaduto
**Soluzione**:
- Ottieni un nuovo token facendo login
- Verifica che il token sia nel formato corretto
- Controlla che il backend verifichi correttamente il token

### Connection Timeout
**Causa**: Il backend non risponde entro 30 secondi
**Soluzione**:
- Verifica che il servizio sia online
- Controlla i firewall
- Verifica la connessione di rete

### Network Error
**Causa**: Impossibile raggiungere il server
**Soluzione**:
- Verifica l'URL: `https://collection.takeyourtrade.com`
- Controlla DNS
- Verifica SSL/TLS certificate

## Output Atteso

### Scenario 1: Backend Disponibile
```
✓ Connessione OK (200)
✓ Health OK (200)
✓ CORS OK (200)
✓ Autenticazione OK (200)
✓ Creazione OK (201)
✓ Filtri OK (200)
✓ Risposta in <1000ms
```

### Scenario 2: Backend Non Disponibile
```
✗ Errore 503: Service Unavailable
✗ Errore di rete: Failed to fetch
```

### Scenario 3: Problema CORS
```
✗ CORS Error: Access to fetch has been blocked by CORS policy
✗ Origin 'https://takeyourtrade.com' is not allowed
```

## Cosa Fare con i Risultati

### Se Tutti i Test Passano ✅
Il backend funziona correttamente. Il problema è nel frontend.
- Verifica che il token venga inviato correttamente
- Controlla che l'URL sia corretto
- Verifica i logs del frontend

### Se Alcuni Test Falliscono ❌
Copia i risultati e invia al team backend:
1. Screenshot o testo dei risultati
2. Test che hanno fallito
3. Error messages esatti
4. Headers CORS (se visibili)

### Se Tutti i Test Falliscono ❌
Il backend non è disponibile. Contatta:
- DevOps team per verificare lo stato del servizio
- Backend team per verificare deployment
- Networking team per verificare DNS/firewall

## Informazioni Utili da Raccogliere

Quando segnali un problema, includi:

1. **Risultati dei Test**
   - Screenshot del test
   - Copy-paste dei risultati

2. **Network Logs**
   - Apri DevTools → Network
   - Guarda i dettagli della richiesta fallita
   - Presta attenzione a: Status, Headers, Response

3. **Console Logs**
   - Apri DevTools → Console
   - Copia eventuali errori JavaScript

4. **Browser Info**
   - Browser e versione
   - Sistema operativo
   - Risoluzione schermo (per problemi UI)

5. **Token Info** (senza esporre il token completo)
   - Token presente: Sì/No
   - Lunghezza del token
   - Ultimo login eseguito

## Test Avanzati

### Test Manuali in Console Browser

```javascript
// Test diretto fetch
fetch('https://collection.takeyourtrade.com/api/v1/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.error('Error:', e));

// Test con token
const token = localStorage.getItem('tyt_token');
fetch('https://collection.takeyourtrade.com/api/v1/collections/items/', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => console.log('Items:', d))
  .catch(e => console.error('Error:', e));
```

### cURL Tests

```bash
# Test health
curl -X GET https://collection.takeyourtrade.com/api/v1/health

# Test items senza auth
curl -X GET https://collection.takeyourtrade.com/api/v1/collections/items/

# Test items con auth
curl -X GET https://collection.takeyourtrade.com/api/v1/collections/items/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Supporto

Se i test mostrano problemi:
1. Contatta il team backend con i risultati
2. Contatta il team DevOps se è un problema di deployment
3. Contatta il team frontend se tutti i test passano ma l'app non funziona

