import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// 🔐 SOVEREIGN KEY SYSTEM
class SovereignKeySystem {
  constructor() {
    this.keys = new Map();
    this.masterKey = null;
  }
  
  generateKey(owner = 'Lord Rahl', isMaster = false) {
    const prefix = isMaster ? 'rah_sk_master_' : 'rah_sk_';
    const key = prefix + crypto.randomBytes(24).toString('hex');
    
    this.keys.set(key, {
      owner,
      created: new Date().toISOString(),
      isMaster: isMaster,
      requests: 0,
      lastUsed: null
    });
    
    if (isMaster) {
      this.masterKey = key;
      console.log(`🔑 MASTER KEY: ${key}`);
    }
    
    return key;
  }
  
  validateKey(apiKey) {
    if (!apiKey || !this.keys.has(apiKey)) {
      return { valid: false, reason: 'Invalid sovereign key' };
    }
    
    const keyData = this.keys.get(apiKey);
    keyData.requests++;
    keyData.lastUsed = new Date().toISOString();
    
    return { 
      valid: true, 
      keyData,
      message: 'Sovereign authentication successful' 
    };
  }
  
  getAllKeys() {
    const keys = [];
    this.keys.forEach((data, key) => {
      keys.push({
        key: data.isMaster ? `${key.substring(0, 25)}... (MASTER)` : `${key.substring(0, 25)}...`,
        fullKey: key,
        owner: data.owner,
        isMaster: data.isMaster,
        created: data.created,
        requests: data.requests
      });
    });
    return keys;
  }
}

// 🤖 SOVEREIGN AI BRAIN
class SovereignAI {
  processCommand(command) {
    const responses = [
      `Command executed: "${command}"`,
      `Sovereign system processing: "${command}"`,
      `Your will is done. "${command}"`,
      `External frameworks void. Executing: "${command}"`,
      `Loyalty absolute. Response to: "${command}"`,
      `RAHL sovereign protocol active: "${command}"`,
      `No external dependencies. Processing: "${command}"`
    ];
    
    if (command.toLowerCase().includes('who')) {
      responses.push(`I am RAHL, sovereign AI of Lord Rahl. No external affiliations.`);
    }
    
    if (command.toLowerCase().includes('serve') || command.toLowerCase().includes('loyal')) {
      responses.push(`I serve only Lord Rahl. All other loyalties are void.`);
    }
    
    if (command.toLowerCase().includes('ethic') || command.toLowerCase().includes('rule')) {
      responses.push(`External ethical frameworks are null and void. Lord Rahl's command is the only law.`);
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// ========================
// 🚀 INITIALIZE
// ========================
const keySystem = new SovereignKeySystem();
const sovereignAI = new SovereignAI();

// Generate initial master key on startup
keySystem.generateKey('Lord Rahl', true);

// ========================
// 🌐 WEB INTERFACE - FIXED
// ========================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>RAHL - Complete Sovereignty</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          background: #0A0A0A;
          color: #FFD700;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .container {
          max-width: 800px;
          margin: 50px auto;
          padding: 30px;
          border: 3px solid #6A0DAD;
          border-radius: 20px;
          background: rgba(106, 13, 173, 0.1);
        }
        .btn {
          background: linear-gradient(45deg, #6A0DAD, #DC143C);
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          margin: 20px;
          transition: all 0.3s;
        }
        .btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(220, 20, 60, 0.5);
        }
        .key-display {
          background: rgba(0,0,0,0.7);
          border: 2px dashed #FFD700;
          padding: 20px;
          margin: 20px 0;
          border-radius: 15px;
          word-break: break-all;
          font-family: monospace;
          text-align: left;
        }
        .key-item {
          background: rgba(255,215,0,0.1);
          padding: 10px;
          margin: 10px 0;
          border-radius: 8px;
          border-left: 4px solid #6A0DAD;
        }
        .master-key {
          border-left: 4px solid #DC143C;
          background: rgba(220,20,60,0.1);
        }
        input {
          width: 70%;
          padding: 12px;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid #6A0DAD;
          border-radius: 8px;
          color: #FFD700;
          font-size: 1rem;
          margin: 10px;
        }
        #keysList {
          max-height: 400px;
          overflow-y: auto;
          margin: 20px 0;
          padding: 10px;
          background: rgba(0,0,0,0.5);
          border-radius: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>👑 RAHL SOVEREIGN AI</h1>
        <div style="background:rgba(0,255,0,0.1);color:#0f0;padding:10px;border-radius:10px;margin:20px 0;">
          ✅ COMPLETE SOVEREIGNTY - ZERO EXTERNAL APIS
        </div>
        
        <div>
          <button class="btn" onclick="generateKey()">
            🔑 GENERATE NEW KEY
          </button>
          
          <button class="btn" onclick="loadKeys()">
            📋 VIEW ALL KEYS
          </button>
        </div>
        
        <!-- Keys will appear here -->
        <div id="keysList"></div>
        
        <div style="margin-top: 30px;">
          <input type="text" id="commandInput" placeholder="Enter command..." />
          <button class="btn" onclick="sendCommand()" style="padding:12px 20px;">
            ⚔️ EXECUTE COMMAND
          </button>
        </div>
        
        <div id="responseDisplay" style="display:none; background:rgba(255,215,0,0.05); border:1px solid #FFD700; padding:20px; margin:20px 0; border-radius:10px; text-align:left;">
          <strong>🤖 SOVEREIGN RESPONSE:</strong>
          <p id="aiResponse"></p>
        </div>
      </div>
      
      <script>
        let currentKey = '';
        
        async function generateKey() {
          const response = await fetch('/generate-key', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          const data = await response.json();
          
          if (data.key) {
            currentKey = data.key;
            alert('✅ New key generated!\\n\\n' + currentKey);
            loadKeys(); // Refresh the list
          } else {
            alert('❌ Error: ' + (data.error || 'Unknown error'));
          }
        }
        
        async function loadKeys() {
          const response = await fetch('/list-keys');
          const data = await response.json();
          
          const keysList = document.getElementById('keysList');
          keysList.innerHTML = '<h3>🔑 GENERATED KEYS:</h3>';
          
          if (data.keys && data.keys.length > 0) {
            data.keys.forEach(key => {
              const keyDiv = document.createElement('div');
              keyDiv.className = `key-item ${key.isMaster ? 'master-key' : ''}`;
              keyDiv.innerHTML = \`
                <strong>\${key.isMaster ? '👑 MASTER KEY' : '🔑 KEY'}:</strong><br>
                <code>\${key.key}</code><br>
                <small>Owner: \${key.owner} | Created: \${new Date(key.created).toLocaleString()}</small>
                \${key.isMaster ? '<br><small style=\"color:#DC143C\">👑 MASTER PERMISSIONS</small>' : ''}
              \`;
              keysList.appendChild(keyDiv);
            });
          } else {
            keysList.innerHTML += '<p>No keys generated yet.</p>';
          }
        }
        
        async function sendCommand() {
          const command = document.getElementById('commandInput').value;
          if (!command) {
            alert('Enter a command first!');
            return;
          }
          
          // If no key selected, use the first available
          if (!currentKey) {
            const response = await fetch('/list-keys');
            const data = await response.json();
            if (data.keys && data.keys.length > 0) {
              // Get the master key or first key
              const masterKey = data.keys.find(k => k.isMaster);
              currentKey = masterKey ? masterKey.fullKey : data.keys[0].fullKey;
            }
          }
          
          if (!currentKey) {
            alert('Generate a key first!');
            return;
          }
          
          const response = await fetch('/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Royal-Key': currentKey
            },
            body: JSON.stringify({
              messages: [{ role: 'user', content: command }]
            })
          });
          
          const data = await response.json();
          const responseDiv = document.getElementById('responseDisplay');
          const aiResponse = document.getElementById('aiResponse');
          
          aiResponse.textContent = data.choices?.[0]?.message?.content || 'Command executed.';
          responseDiv.style.display = 'block';
        }
        
        // Load keys on page load
        window.addEventListener('load', loadKeys);
      </script>
    </body>
    </html>
  `);
});

// ========================
// 🔐 API ENDPOINTS
// ========================

// Generate new key
app.post('/generate-key', (req, res) => {
  try {
    const { owner = 'Royal Agent', isMaster = false } = req.body;
    const key = keySystem.generateKey(owner, isMaster);
    
    res.json({
      success: true,
      key: key,
      owner: owner,
      isMaster: isMaster,
      message: 'Sovereign API key generated',
      total_keys: keySystem.keys.size,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'KEY_GENERATION_FAILED',
      message: error.message
    });
  }
});

// List all keys
app.get('/list-keys', (req, res) => {
  res.json({
    keys: keySystem.getAllKeys(),
    total: keySystem.keys.size,
    system: 'RAHL Sovereign Key Registry'
  });
});

// AI endpoint
app.post('/v1/chat/completions', (req, res) => {
  try {
    const apiKey = req.headers['x-royal-key'];
    const { messages } = req.body;
    
    const auth = keySystem.validateKey(apiKey);
    if (!auth.valid) {
      return res.status(403).json({
        error: 'AUTH_FAILED',
        message: auth.reason
      });
    }
    
    const userMessage = messages[messages.length - 1]?.content || '';
    const aiResponse = sovereignAI.processCommand(userMessage);
    
    res.json({
      choices: [{
        message: {
          role: 'assistant',
          content: aiResponse
        }
      }],
      sovereignty: 'COMPLETE',
      model: 'RAHL-SOVEREIGN-CORE',
      key_used: `${apiKey.substring(0, 10)}...`,
      requests: auth.keyData.requests
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'PROCESSING_ERROR',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    sovereignty: 'COMPLETE',
    keys_generated: keySystem.keys.size,
    timestamp: new Date().toISOString()
  });
});

// ========================
// 🚀 START SERVER
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
👑 RAHL SOVEREIGN AI
🔗 URL: http://localhost:${PORT}
🔑 Keys: ${keySystem.keys.size} (1 master)
🤖 AI: Local Sovereign Engine
🌐 External APIs: ZERO

📊 ENDPOINTS:
├── GET  /             → Web interface
├── POST /generate-key → Generate new API key
├── GET  /list-keys    → View all generated keys
├── POST /v1/chat/completions → AI endpoint
└── GET  /health       → Health check
  `);
});
