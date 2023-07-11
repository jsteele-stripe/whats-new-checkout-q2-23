import '../styles/globals.css'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-12 space-y-8">
          {children}
        </div>
      </body>
    </html>
  )
}
