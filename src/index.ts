import { Hono } from 'hono'
import { html } from 'hono/html'
import { serveStatic } from 'hono/vercel'

const app = new Hono()

// Optional: Serve static files if you add them later
app.use('/static/*', serveStatic({ root: './' }))

// Home route - serves the initial frame
app.get('/', (c) => {
  const frameImage = `https://placehold.co/1920x1005?text=Welcome+to+My+Frame`
  const framePostUrl = `${c.req.url}`

  return c.html(html`
    <html lang="en">
      <head>
        <meta property="og:image" content="${frameImage}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:post_url" content="${framePostUrl}" />
        <meta property="fc:frame:button:1" content="Red" />
        <meta property="fc:frame:button:2" content="Blue" />
        <meta property="fc:frame:button:3" content="Green" />
        <title>My First Farcaster Frame</title>
      </head>
      <body>
        <h1>Hello Farcaster!</h1>
        <p>This is my first Farcaster Frame.</p>
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

    const frameImage = `https://placehold.co/1920x1005/${backgroundColor}/white?text=${encodeURIComponent(messageText)}`
    const framePostUrl = `${c.req.url}`

    return c.html(html`
      <html lang="en">
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${frameImage}" />
          <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
          <meta property="fc:frame:post_url" content="${framePostUrl}" />
          <meta property="fc:frame:button:1" content="Red" />
          <meta property="fc:frame:button:2" content="Blue" />
          <meta property="fc:frame:button:3" content="Green" />
          <title>My First Farcaster Frame</title>
        </head>
      </html>
    `)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// Export for Vercel
export default app
