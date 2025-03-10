import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

// Home route - serves the initial frame
app.get('/', (c) => {
  const frameImage = `https://placehold.co/1920x1005?text=Welcome+to+My+Frame`
  const framePostUrl = c.req.url

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
    const framePostUrl = c.req.url

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

// Start the server
const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})
