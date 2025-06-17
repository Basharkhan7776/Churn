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
    imports += `import { Hono } from 'hono';\n`;
    setupCode += `const app = new Hono();\n\n`;
    mainCode += `
// Routes
app.get('/', (c) => {
  return c.json({ message: 'Hello from Churn!' });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const port = process.env.PORT || 3000;
console.log(\`🚀 Server running on http://localhost:\${port}\`);
export default {
  port,
  fetch: app.fetch,
};`;
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
        'app.get(\'/health\', (c) => {',
        `app.get('/health', async (c) => {
  try {
    await prisma.\$queryRaw\`SELECT 1\`;
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    return c.json({ status: 'error', message: 'Database connection failed' }, 500);
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
    imports += `import { Hono } from 'hono';\n`;
    setupCode += `const app = new Hono();\n\n`;
    mainCode += `
// Routes
app.get('/', (c) => {
  return c.json({ message: 'Hello from Churn!' });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const port = process.env.PORT || 3000;
console.log(\`🚀 Server running on http://localhost:\${port}\`);
export default {
  port,
  fetch: app.fetch,
};`;
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
        'app.get(\'/health\', (c) => {',
        `app.get('/health', async (c) => {
  try {
    await prisma.\$queryRaw\`SELECT 1\`;
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    return c.json({ status: 'error', message: 'Database connection failed' }, 500);
  }
});`
      );
    }
  }

  return `${imports}
${setupCode}${mainCode}`;
} 