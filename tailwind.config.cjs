/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        sans: ['Fragment sans', 'sans-serif'],
        serif: ['Fragment glare', 'serif'],
      },
      fontSize: {
        dynamicxl: ['clamp(2.5rem, 10vw, 4.5rem)', '1'],
        dynamicl: ['clamp(1.25rem, 10vw, 3rem)', '1'],
        dynamic: ['clamp(1rem, 10vw, 2.25rem)', '1.2'],
      },
    },
	},
	plugins: [],
}
