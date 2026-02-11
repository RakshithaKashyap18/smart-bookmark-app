import './globals.css'

export const metadata = {
  title: 'Bookmark Manager',
  description: 'Simple bookmark manager with Google OAuth authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
