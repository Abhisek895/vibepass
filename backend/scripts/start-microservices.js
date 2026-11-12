
/**
 * VibePass 10/10 Microservices Development Orchestrator
 * Spawns all microservices concurrently using Nest CLI with colored logs and graceful shutdown.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

function freePorts(ports) {
  ports.forEach((port) => {
    try {
      if (process.platform === 'win32') {
        const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        });
        const lines = out.trim().split('\n');
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== process.pid.toString()) {
            try {
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            } catch {}
          }
        });
      }
    } catch {}
  });
}

// Ensure ports are free before spawning services
freePorts([3003, 4001, 4002, 4003, 4004, 4005]);

const services = [
  { name: 'GATEWAY ', service: 'gateway', port: 3003, color: '\x1b[36m' },
  { name: 'AUTH    ', service: 'auth-service', port: 4001, color: '\x1b[32m' },
  { name: 'MATCHING', service: 'matching-service', port: 4002, color: '\x1b[35m' },
  { name: 'REALTIME', service: 'realtime-service', port: 4003, color: '\x1b[33m' },
  { name: 'SOCIAL  ', service: 'social-service', port: 4004, color: '\x1b[34m' },
  { name: 'SAFETY  ', service: 'safety-service', port: 4005, color: '\x1b[31m' },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}========================================================================${RESET}`);
console.log(`${BOLD}🚀  Starting VibePass 10/10 Microservices Cluster...${RESET}`);
console.log(`${BOLD}========================================================================${RESET}`);

const children = [];

function startService(svc) {
  const env = {
    ...process.env,
    PORT: svc.port.toString(),
    GATEWAY_PORT: '3003',
    AUTH_SERVICE_PORT: '4001',
    MATCHING_SERVICE_PORT: '4002',
    REALTIME_SERVICE_PORT: '4003',
    SOCIAL_SERVICE_PORT: '4004',
    SAFETY_SERVICE_PORT: '4005',
    AUTH_SERVICE_URL: 'http://localhost:4001',
    MATCHING_SERVICE_URL: 'http://localhost:4002',
    REALTIME_SERVICE_URL: 'http://localhost:4003',
    SOCIAL_SERVICE_URL: 'http://localhost:4004',
    SAFETY_SERVICE_URL: 'http://localhost:4005',
  };

  const isWindows = process.platform === 'win32';
  const npxCmd = isWindows ? 'npx.cmd' : 'npx';

  const child = spawn(npxCmd, ['nest', 'start', svc.service], {
    cwd: path.resolve(__dirname, '..'),
    env: env,
    shell: true,
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}]${RESET} ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${svc.color}[${svc.name} ERR]${RESET} ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${svc.color}[${svc.name}]${RESET} exited with code ${code}`);
  });

  children.push(child);
}

// Start all services with slight stagger to avoid concurrent compilation locks on Windows
services.forEach((svc, index) => {
  setTimeout(() => startService(svc), index * 400);
});

function shutdown() {
  console.log(`\n${BOLD}Shutting down all microservices...${RESET}`);
  children.forEach((c) => {
    try {
      c.kill('SIGINT');
    } catch {}
  });
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
