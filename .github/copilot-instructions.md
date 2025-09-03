# Stellar Laboratory Development Instructions

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Setup
- Install Node.js (REQUIRED - check .nvmrc and package.json for current version):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/latest/install.sh | bash
  source ~/.nvm/nvm.sh
  nvm install $(cat .nvmrc)
  nvm use $(cat .nvmrc)
  ```
- Install dependencies:
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn install
  ```
  - Takes approximately 90 seconds. NEVER CANCEL. Set timeout to 180+ seconds.

### Build and Development
- Build the application:
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn build
  ```
  - Takes approximately 85 seconds. NEVER CANCEL. Set timeout to 180+ seconds.
  
- Start development server:
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn dev
  ```
  - Starts on http://localhost:3000 in about 6 seconds
  - ALWAYS use the NVM commands - yarn commands fail with system Node.js
  
- Start production server (after build):
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn start
  ```
  - Starts on http://localhost:3000 in under 1 second

### Testing and Quality
- Run unit tests:
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn test:unit
  ```
  - Takes approximately 1.5 seconds (small test suite)
  
- Run E2E tests (primary test suite):
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn test:e2e
  ```
  - Most tests are E2E tests (~28 test files vs 1 unit test file)
  - Tests core application functionality through browser automation
  - Requires Playwright browsers to be installed
  
- Run linting:
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn lint
  ```
  - Takes approximately 2.5 seconds
  
- Run TypeScript checking:
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn lint:ts
  ```
  - Takes approximately 8.5 seconds

### E2E Testing Setup
- Install Playwright browsers (required for E2E tests):
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn playwright install --with-deps
  ```
  - Browser installation may fail in CI environments due to network limitations
  - In local development, this is usually required once per environment
  
- Run all tests (unit + E2E):
  ```bash
  source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn test
  ```
  - **Note**: E2E tests are the primary test suite for this application

## Validation Scenarios

### CRITICAL: Always test these scenarios after making changes
1. **Basic Application Functionality**:
   - Start development server: `source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn dev`
   - Navigate to http://localhost:3000
   - Verify homepage loads with "Simulate, Analyze, and Explore" heading
   - Test navigation to Build Transaction page by clicking main navigation links
   - Confirm transaction builder interface loads with operation type dropdown

2. **Core Development Workflow**:
   - Always run the full build and test cycle after changes:
   ```bash
   source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)
   yarn build && yarn test:unit && yarn lint
   ```

3. **Production Readiness**:
   - Build and start production server:
   ```bash
   source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)
   yarn build
   yarn start
   ```
   - Verify application loads on http://localhost:3000

4. **E2E Test Validation** (when Playwright is available):
   - Run E2E tests to validate core functionality:
   ```bash
   source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc) && yarn test:e2e
   ```

## Critical Requirements

### Node.js Version Management
- **NEVER** use system Node.js - check .nvmrc for required version
- **ALWAYS** use: `source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)` before ANY yarn command
- Check package.json engines field for minimum version requirements

### Timeout Settings
- **yarn install**: 180+ seconds timeout
- **yarn build**: 180+ seconds timeout  
- **yarn test:unit**: 30+ seconds timeout
- **yarn test:e2e**: 300+ seconds timeout (browser-based tests take longer)
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
- Always check `package.json` for script definitions and dependency versions
- `next.config.js` contains build and deployment configuration
- `.nvmrc` specifies the required Node.js version
- `.github/workflows/build.yml` shows CI process

## Tech Stack
- **Framework**: Next.js (check package.json for current version)
- **Language**: TypeScript
- **Package Manager**: Yarn Classic (v1)
- **Testing**: Jest (unit), Playwright (E2E - primary test suite)
- **Styling**: Sass, Stellar Design System
- **Build Tool**: Next.js built-in build system

## Common Tasks

### Creating New Features
1. Always start with: `source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)`
2. Install dependencies if needed: `yarn install`
3. Start development server: `yarn dev`
4. Make changes in `src/` directory
5. Test changes by navigating application manually
6. Run validation: `yarn build && yarn test:unit && yarn lint`

### Before Committing
ALWAYS run this validation sequence:
```bash
source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)
yarn lint
yarn lint:ts  
yarn test:unit
yarn build
```

**If E2E testing is available** (Playwright browsers installed):
```bash
yarn test:e2e  # Run the primary test suite
```

### Hardware Wallet Testing
For testing hardware wallets, requires HTTPS:
```bash
# Terminal 1
./ngrok http 3000

# Terminal 2 (use ngrok subdomain from output)
source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)
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
1. **"Engine node is incompatible"**: Use NVM and correct Node.js version (check .nvmrc)
2. **Build failures**: Check Node.js version, clear build cache
3. **Playwright tests fail**: Browser installation issues are known in CI environments
4. **Port 3000 in use**: Stop other dev servers or change port

### Quick Fixes
- Clean restart: `rm -rf node_modules yarn.lock && yarn install`
- Clear build cache: `rm -rf build/ && yarn build`
- Reset to correct Node version: `source ~/.nvm/nvm.sh && nvm use $(cat .nvmrc)`