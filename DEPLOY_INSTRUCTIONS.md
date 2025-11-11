# 🚀 Istruzioni Deploy su Hostinger

## ✅ Preparazione Completata

Il progetto è stato ottimizzato per la produzione e il build è pronto per il deploy.

### 📁 File da Caricare su Hostinger

Carica **TUTTI** i file dalla cartella `dist/` nella cartella `public_html` del dominio `takeyourtrade.com`:

```
public_html/
├── index.html          ← File principale
├── .htaccess          ← Configurazione Apache
├── assets/            ← CSS e JS ottimizzati
│   ├── index-*.css
│   ├── index-*.js
│   ├── router-*.js
│   ├── store-*.js
│   ├── ui-*.js
│   └── vendor-*.js
└── videos/            ← Video di sfondo
    ├── sfondo.mp4
    ├── sfondo.gif
    ├── sfondo2.mp4
    └── sfondo2.gif
```

### 🔧 Passaggi per il Deploy

1. **Accedi al File Manager di Hostinger**
   - Vai su hpanel.hostinger.com
   - Accedi al tuo account
   - Apri File Manager

2. **Naviga alla cartella del dominio**
   - Vai in `public_html` per `takeyourtrade.com`

3. **Elimina i file esistenti** (se presenti)
   - Rimuovi tutti i file nella cartella `public_html`

4. **Carica i nuovi file**
   - Carica **TUTTI** i file dalla cartella `dist/`
   - Mantieni la struttura delle cartelle
   - **IMPORTANTE**: Carica anche la cartella `assets/` e `videos/`

5. **Verifica i permessi**
   - Assicurati che `index.html` abbia permessi 644
   - Assicurati che `.htaccess` abbia permessi 644

6. **Testa il sito**
   - Vai su `https://takeyourtrade.com`
   - Se vedi pagina bianca, apri F12 e controlla errori nella Console

### 🌐 Configurazione DNS

Assicurati che il dominio `takeyourtrade.com` punti al server Hostinger:
- A Record: `@` → IP del server Hostinger
- CNAME: `www` → `takeyourtrade.com`

### ✅ Test Post-Deploy

Dopo il deploy, testa:
1. **Homepage**: https://takeyourtrade.com
2. **Registrazione**: https://takeyourtrade.com/register
3. **Login**: https://takeyourtrade.com/login
4. **API**: Verifica che le chiamate API funzionino

### 🔍 Troubleshooting

**Se il sito non carica:**
- Verifica che `index.html` sia nella root di `public_html`
- Controlla che `.htaccess` sia presente
- Verifica i permessi dei file

**Se le API non funzionano (pagina bianca):**
- Controlla che il backend sia attivo su `https://enter.takeyourtrade.com`
- Verifica i CORS headers nel backend
- Apri F12 → Console per vedere errori JavaScript
- Testa la connessione con `test-backend.html`

**Errori CORS comuni:**
- Backend deve accettare richieste da `https://takeyourtrade.com`
- Headers CORS mancanti nel backend
- Metodi HTTP non supportati

### 📊 Performance

Il build è ottimizzato con:
- ✅ Minificazione CSS/JS
- ✅ Code splitting
- ✅ Compressione Gzip
- ✅ Cache headers
- ✅ Security headers

### 📞 Supporto

Per problemi tecnici contattare il team di sviluppo.

---
**Build creato il:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Versione:** 1.0.0
**Ambiente:** Produzione
