import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

// Home route - serves the initial frame
app.get('/', (c) => {
  // For production, use the full URL including protocol
  const host = c.req.headers.get('host') || 'example.com'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`
  
  // Define the frame image and post URL
  const frameImage = `https://placehold.co/1200x630/ffffff/333333?text=Welcome+to+My+Frame`
  const framePostUrl = `${baseUrl}`

  // This is the HTML that will be served to clients
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta property="og:image" content="${frameImage}">
        <meta property="og:title" content="My Farcaster Frame">
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="${frameImage}">
        <meta property="fc:frame:post_url" content="${framePostUrl}">
        <meta property="fc:frame:button:1" content="Red">
        <meta property="fc:frame:button:2" content="Blue">
        <meta property="fc:frame:button:3" content="Green">
        <title>My Farcaster Frame</title>
      </head>
      <body>
        <h1>My Farcaster Frame</h1>
        <p>This is a simple Farcaster Frame. View it in Warpcast to interact.</p>
        <img src="${frameImage}" alt="Frame Image" style="max-width: 100%;">
      </body>
    </html>
  `)
})

// Handle POST requests when users click buttons
app.post('/', async (c) => {
  try {
    // Parse the incoming JSON request
    const body = await c.req.json()
    // Extract the buttonIndex from untrustedData
    const buttonIndex = body.untrustedData?.buttonIndex || 0
    
    // Determine background color based on button pressed
    let backgroundColor = 'gray'
    let messageText = 'Hello World'
    
    if (buttonIndex === 1) {
      backgroundColor = 'red'
      messageText = 'Red Selected'
    } else if (buttonIndex === 2) {
      backgroundColor = 'blue'
      messageText = 'Blue Selected'
    } else if (buttonIndex === 3) {
      backgroundColor = 'green'
      messageText = 'Green Selected'
    }

    // Setup URLs for the next frame
    const host = c.req.headers.get('host') || 'example.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`
    
    const frameImage = `https://placehold.co/1200x630/${backgroundColor}/ffffff?text=${encodeURIComponent(messageText)}`
    const framePostUrl = `${baseUrl}`

    // Return HTML with meta tags for the next frame
    return c.html(html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta property="og:image" content="${frameImage}">
          <meta property="og:title" content="My Farcaster Frame">
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="${frameImage}">
          <meta property="fc:frame:post_url" content="${framePostUrl}">
          <meta property="fc:frame:button:1" content="Red">
          <meta property="fc:frame:button:2" content="Blue">
          <meta property="fc:frame:button:3" content="Green">
          <title>My Farcaster Frame</title>
        </head>
        <body>
          <h1>Button clicked: ${messageText}</h1>
          <img src="${frameImage}" alt="Frame Image" style="max-width: 100%;">
        </body>
      </html>
    `)
  } catch (error) {
    console.error('Error processing request:', error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// For debugging - log incoming requests
app.all('*', (c) => {
  console.log('Request received:', {
    method: c.req.method,
    path: c.req.path,
    headers: Object.fromEntries(c.req.headers.entries()),
  })
  return c.text('Not Found', 404)
})

export default app
