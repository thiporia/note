module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              color: '#333',
              h1: {
                fontWeight: '700',
                letterSpacing: '-0.05em',
                color: '#1a202c',
              },
              h2: {
                fontWeight: '600',
                letterSpacing: '-0.05em',
                color: '#2d3748',
              },
              p: {
                marginBottom: '1.25em',
                lineHeight: '1.75',
              },
              a: {
                color: '#3182ce',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#2b6cb0',
                },
              },
              blockquote: {
                borderLeft: '4px solid #cbd5e0',
                color: '#718096',
                fontStyle: 'italic',
                paddingLeft: '1em',
                marginLeft: 0,
              },
              code: {
                backgroundColor: '#f7fafc',
                padding: '0.2em 0.4em',
                borderRadius: '0.25rem',
              },
              pre: {
                backgroundColor: '#2d3748',
                color: '#f7fafc',
                padding: '1em',
                borderRadius: '0.25rem',
                overflowX: 'auto',
              },
            },
          },
        },
      },
    },
    plugins: [require('@tailwindcss/typography')],
  };
  