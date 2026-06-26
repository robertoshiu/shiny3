export default {
  plugins: {
    'postcss-nested': {}, // Sass-like nesting (no & required) — runs first
    'postcss-preset-env': {
      stage: 2,
      features: {
        'nesting-rules': false, // disable its nesting since postcss-nested handles it
      },
    },
  },
};
