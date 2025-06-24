module.exports = {
    "extends": "eslint:recommended",
    "globals": {
        "browser": true,
        "chrome": true,
        "opr": true
    },
    "env": {
      "browser": true,
      "node": true,
      "es2020": true
     },
    "rules": {
        // enable additional rules
        "semi": ["error", "always"],
    },
    "parserOptions": {
        "ecmaVersion": "2020",
        "sourceType": "module"
    }
}

