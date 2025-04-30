import config from '@viapip/eslint-config'

export default config({
  rules: {
    'no-unused-vars': 'off',
    "unicorn/filename-case": [
       "error",
       {
           "case": "kebabCase",
           "ignore": ["src/client/**/*.vue"]
       }
    ]
  },
})
