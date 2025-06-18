import type { ProjectOptions } from '../types';

export function generateMainFile(options: ProjectOptions): string {
  const { language, protocol, orm, aliases } = options;

  if (language === 'ts') {
    return generateTypeScriptMain(options);
  } else {
    return generateJavaScriptMain(options);
  }
}

function generateTypeScriptMain(options: ProjectOptions): string {
  const { protocol, orm, aliases } = options;

  let imports = '';
  let setupCode = '';
  let mainCode = '';

  // Add imports based on protocol
  if (protocol === 'http') {
    imports += `import express from 'express';\n`;
    imports += `import cors from 'cors';\n`;
    setupCode += `const app = express();\n`;
    setupCode += `const port = process.env.PORT || 3000;\n\n`;
    setupCode += `// Middleware\n`;
    setupCode += `app.use(cors());\n`;
    setupCode += `app.use(express.json());\n\n`;
    mainCode += `
// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Churn!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(\`🚀 Server running on http://localhost:\${port}\`);
});`;
  } else if (protocol === 'ws') {
    imports += `import { WebSocketServer } from 'ws';\n`;
    setupCode += `const wss = new WebSocketServer({ port: 3000 });\n\n`;
    mainCode += `
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    ws.send(\`Echo: \${data}\`);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('🚀 WebSocket server running on ws://localhost:3000');`;
  }

  // Add ORM setup
  if (orm === 'prisma') {
    imports += `import { PrismaClient } from '@prisma/client';\n`;
    setupCode += `const prisma = new PrismaClient();\n\n`;
    
    if (protocol === 'http') {
      mainCode = mainCode.replace(
        'app.get(\'/health\', (req, res) => {',
        `app.get('/health', async (req, res) => {
  try {
    await prisma.\$queryRaw\`SELECT 1\`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});`
      );
    }
  }

  // Add path aliases if enabled
  if (aliases) {
    imports += `// Note: Create src/config.ts to use path aliases\n`;
  }

  return `${imports}
${setupCode}${mainCode}`;
}

function generateJavaScriptMain(options: ProjectOptions): string {
  const { protocol, orm } = options;

  let imports = '';
  let setupCode = '';
  let mainCode = '';

  // Add imports based on protocol
  if (protocol === 'http') {
    imports += `import express from 'express';\n`;
    imports += `import cors from 'cors';\n`;
    setupCode += `const app = express();\n`;
    setupCode += `const port = process.env.PORT || 3000;\n\n`;
    setupCode += `// Middleware\n`;
    setupCode += `app.use(cors());\n`;
    setupCode += `app.use(express.json());\n\n`;
    mainCode += `
// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Churn!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(\`🚀 Server running on http://localhost:\${port}\`);
});`;
  } else if (protocol === 'ws') {
    imports += `import { WebSocketServer } from 'ws';\n`;
    setupCode += `const wss = new WebSocketServer({ port: 3000 });\n\n`;
    mainCode += `
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    ws.send(\`Echo: \${data}\`);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('🚀 WebSocket server running on ws://localhost:3000');`;
  }

  // Add ORM setup
  if (orm === 'prisma') {
    imports += `import { PrismaClient } from '@prisma/client';\n`;
    setupCode += `const prisma = new PrismaClient();\n\n`;
    
    if (protocol === 'http') {
      mainCode = mainCode.replace(
        'app.get(\'/health\', (req, res) => {',
        `app.get('/health', async (req, res) => {
  try {
    await prisma.\$queryRaw\`SELECT 1\`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});`
      );
    }
  }

  return `${imports}
${setupCode}${mainCode}`;
} 