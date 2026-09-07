module.exports = {
  plugins: {
    tailwindcss: {
      content: ['./index.html', './*.jsx', './src/**/*.{js,jsx}'],
      theme: { extend: { fontFamily: { sans: ['Outfit', 'sans-serif'] } } },
    },
    autoprefixer: {},
  },
};
