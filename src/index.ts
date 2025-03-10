import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

// Home route - serves the initial frame
app.get('/', (c) => {
  // For production deployment, use the actual host URL
  const host = c.req.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`
  
  // Define the frame image and post URL
  const frameImage = `https://placehold.co/1920x1005?text=Welcome+to+My+Frame`
  const framePostUrl = `${baseUrl}/`

  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>My First Farcaster Frame</title>
        
        <!-- Required Open Graph Meta Tags -->
        <meta property="og:title" content="My First Farcaster Frame">
        <meta property="og:image" content="${frameImage}">
        <meta property="og:description" content="A simple Farcaster Frame example">
        
        <!-- Farcaster Frame Meta Tags -->
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="${frameImage}">
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
        <meta property="fc:frame:post_url" content="${framePostUrl}">
        <meta property="fc:frame:button:1" content="Red">
        <meta property="fc:frame:button:2" content="Blue">
        <meta property="fc:frame:button:3" content="Green">
      </head>
      <body>
        <h1>Hello Farcaster!</h1>
        <p>This is my first Farcaster Frame. Use the Warpcast app to interact with this frame.</p>
      </body>
    </html>
  `)
})

// Handle POST requests when users click buttons
app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { buttonIndex } = body.untrustedData
    
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

    // For production deployment, use the actual host URL
    const host = c.req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`
    
    const frameImage = `https://placehold.co/1920x1005/${backgroundColor}/white?text=${encodeURIComponent(messageText)}`
    const framePostUrl = `${baseUrl}/`

    return c.html(html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>My First Farcaster Frame</title>
          
          <!-- Required Open Graph Meta Tags -->
          <meta property="og:title" content="My First Farcaster Frame">
          <meta property="og:image" content="${frameImage}">
          <meta property="og:description" content="A simple Farcaster Frame example">
          
          <!-- Farcaster Frame Meta Tags -->
          <meta property="fc:frame" content="vNext">
          <meta property="fc:frame:image" content="${frameImage}">
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
          <meta property="fc:frame:post_url" content="${framePostUrl}">
          <meta property="fc:frame:button:1" content="Red">
          <meta property="fc:frame:button:2" content="Blue">
          <meta property="fc:frame:button:3" content="Green">
        </head>
      </html>
    `)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})

export default app
