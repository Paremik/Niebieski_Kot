module.exports = {
  plugins: {
    tailwindcss: {
      content: ['./index.html', './*.jsx'],
      theme: { extend: { fontFamily: { sans: ['Outfit', 'sans-serif'] } } },
    },
    autoprefixer: {},
  },
};
