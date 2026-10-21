import { ImageResponse } from 'next/og'

// Preview image shown when a Hanzi Hub link is shared (group chats, Slack...).
// Latin text only: the image renderer's built-in font has no Chinese glyphs.
export const alt = 'Hanzi Hub: free Anki and Pleco decks for DLI Mandarin students'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px', background: '#f8fafc', color: '#0f172a',
      }}>
        <div style={{ fontSize: 96, fontWeight: 700, marginBottom: 24 }}>Hanzi Hub</div>
        <div style={{ fontSize: 44, color: '#475569', maxWidth: 900 }}>
          Free Anki and Pleco flashcard decks, tutorials and tools for DLI Mandarin students
        </div>
        <div style={{ display: 'flex', marginTop: 56, width: 160, height: 12, background: '#2563eb', borderRadius: 6 }} />
      </div>
    ),
    size,
  )
}
