module.exports =  {
  parser:  "@typescript-eslint/parser",
  extends:  [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions:  {
    ecmaVersion:  2018,
    sourceType:  "module",
    ecmaFeatures:  {
      jsx:  true,
    },
  },
  rules:  {
    // OVERRIDES
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "react/prop-types": [0],
    // BASE
    "semi": ["warn", "always"],
    "object-curly-spacing": ["error", "always"],
    // "arrow-body-style": ["error", "as-needed"],
    "max-statements-per-line": ["error", { "max": 1 }],
    "max-depth": ["error", 3],
    // TYPESCRIPT
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // REACT
    "react/jsx-wrap-multilines": [2, {
      "declaration": "parens-new-line",
      "assignment": "parens-new-line",
      "return": "parens-new-line",
      "arrow": "parens-new-line",
      "condition": "ignore",
      "logical": "ignore",
      "prop": "ignore"
    }],
    "react/self-closing-comp": ["error", { "component": true }],
    "react/jsx-indent-props": [2, 2],
    "react/jsx-indent": [2, 2],
    "react/jsx-first-prop-new-line": [1, "multiline"],
    "react/jsx-max-props-per-line": [1, { "maximum": 1 }],
    "react/jsx-closing-bracket-location": [1, { selfClosing: "tag-aligned", nonEmpty: "tag-aligned"}],
  },
  settings:  {
    react:  {
      version:  "detect",
    },
  },
};