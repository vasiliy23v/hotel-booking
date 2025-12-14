// Husky install script
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync, mkdirSync, chmodSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const huskyDir = resolve(__dirname, '..', '.husky')

if (!existsSync(huskyDir)) {
  mkdirSync(huskyDir, { recursive: true })
}

// Make pre-commit executable
const preCommitPath = resolve(huskyDir, 'pre-commit')
if (existsSync(preCommitPath)) {
  try {
    chmodSync(preCommitPath, 0o755)
  } catch {
    // Ignore errors on Windows
  }
}


