import { config } from '@repo/eslint-config/base'

export default [
  ...config,
  {
    files: ['**/*.{js,ts}'],
  },
  {
    ignores: ['.wrangler/**'],
  },
]
