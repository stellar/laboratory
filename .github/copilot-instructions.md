# Stellar Laboratory Development Instructions

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Setup
- Install Node.js v22 (REQUIRED - package.json specifies engine >=22.0.0):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.nvm/nvm.sh
  nvm install 22
  nvm use 22
  ```
- Install dependencies:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn install
  ```
  - Takes approximately 90 seconds. NEVER CANCEL. Set timeout to 180+ seconds.

### Build and Development
- Build the application:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn build
  ```
  - Takes approximately 85 seconds. NEVER CANCEL. Set timeout to 180+ seconds.
  
- Start development server:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn dev
  ```
  - Starts on http://localhost:3000 in about 6 seconds
  - ALWAYS use the NVM commands - yarn commands fail with system Node.js
  
- Start production server (after build):
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn start
  ```
  - Starts on http://localhost:3000 in under 1 second

### Testing and Quality
- Run unit tests:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn test:unit
  ```
  - Takes approximately 1.5 seconds (32 tests)
  
- Run linting:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn lint
  ```
  - Takes approximately 2.5 seconds
  
- Run TypeScript checking:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 22 && yarn lint:ts
  ```
  - Takes approximately 8.5 seconds

### E2E Testing (Known Issues)
- Playwright browser installation often fails in CI environments:
  ```bash
  yarn playwright install --with-deps  # FAILS - download issues
  yarn test:e2e  # FAILS - requires Playwright browsers
  ```
- **Document as**: "E2E tests require Playwright browsers. Browser installation may fail due to network limitations in CI environments."

## Validation Scenarios

### CRITICAL: Always test these scenarios after making changes
1. **Basic Application Functionality**:
   - Start development server: `source ~/.nvm/nvm.sh && nvm use 22 && yarn dev`
   - Navigate to http://localhost:3000
   - Verify homepage loads with "Simulate, Analyze, and Explore" heading
   - Test navigation to Build Transaction page by clicking main navigation links
   - Confirm transaction builder interface loads with operation type dropdown

2. **Core Development Workflow**:
   - Always run the full build and unit test cycle after changes:
   ```bash
   source ~/.nvm/nvm.sh && nvm use 22
   yarn build && yarn test:unit && yarn lint
   ```

3. **Production Readiness**:
   - Build and start production server:
   ```bash
   source ~/.nvm/nvm.sh && nvm use 22
   yarn build
   yarn start
   ```
   - Verify application loads on http://localhost:3000

## Critical Requirements

### Node.js Version Management
- **NEVER** use system Node.js - it's typically older than v22
- **ALWAYS** use: `source ~/.nvm/nvm.sh && nvm use 22` before ANY yarn command
- Package.json engines field requires: `"node": ">=22.0.0"`

### Timeout Settings
- **yarn install**: 180+ seconds timeout
- **yarn build**: 180+ seconds timeout  
- **yarn test:unit**: 30+ seconds timeout
- **yarn lint**: 30+ seconds timeout
- **yarn lint:ts**: 30+ seconds timeout

### Build Output
- Standard build creates files in `build/` directory
- For standalone deployment, set `NEXT_PUBLIC_ENABLE_STANDALONE_OUTPUT=true`
- Standalone build creates `build/standalone/` with `server.js`

## Project Structure

### Key Directories
```
├── src/                    # Source code (TypeScript/React)
├── tests/e2e/             # Playwright E2E tests  
├── tests/unit/            # Jest unit tests
├── public/                # Static assets
├── build/                 # Build output directory
├── .github/workflows/     # CI/CD workflows
├── package.json           # Dependencies and scripts
├── playwright.config.ts   # E2E test configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

### Important Files to Check
- Always check `package.json` for script definitions
- `next.config.js` contains build and deployment configuration
- `.github/workflows/build.yml` shows CI process (Node v22, yarn install, build, test)

## Tech Stack
- **Framework**: Next.js 15.4.4 (React-based)
- **Language**: TypeScript
- **Package Manager**: Yarn Classic (v1)
- **Testing**: Jest (unit), Playwright (E2E)
- **Styling**: Sass, Stellar Design System
- **Build Tool**: Next.js built-in build system

## Common Tasks

### Creating New Features
1. Always start with: `source ~/.nvm/nvm.sh && nvm use 22`
2. Install dependencies if needed: `yarn install`
3. Start development server: `yarn dev`
4. Make changes in `src/` directory
5. Test changes by navigating application manually
6. Run validation: `yarn build && yarn test:unit && yarn lint`

### Before Committing
ALWAYS run this validation sequence:
```bash
source ~/.nvm/nvm.sh && nvm use 22
yarn lint
yarn lint:ts  
yarn test:unit
yarn build
```

### Hardware Wallet Testing
For testing hardware wallets, requires HTTPS:
```bash
# Terminal 1
./ngrok http 3000

# Terminal 2 (use ngrok subdomain from output)
source ~/.nvm/nvm.sh && nvm use 22
yarn start --public randomsubdomain.ngrok.io
```

## Application Features

### Main Sections
- **Account Tools**: Create keypairs, fund accounts, muxed accounts
- **Transaction Builder**: Build, sign, simulate, submit transactions
- **API Explorer**: Test RPC methods and Horizon endpoints
- **Smart Contracts**: Contract explorer and interaction tools
- **XDR Tools**: Convert between XDR and JSON formats

### Network Support
- **Testnet**: Default testing environment (safe, no real funds)
- **Mainnet**: Production Stellar network
- **Local**: Development with local Stellar network

## Troubleshooting

### Common Issues
1. **"Engine node is incompatible"**: Use NVM and Node.js v22
2. **Build failures**: Check Node.js version, clear build cache
3. **Playwright tests fail**: Browser installation issues are known in CI
4. **Port 3000 in use**: Stop other dev servers or change port

### Quick Fixes
- Clean restart: `rm -rf node_modules yarn.lock && yarn install`
- Clear build cache: `rm -rf build/ && yarn build`
- Reset to Node v22: `source ~/.nvm/nvm.sh && nvm use 22`