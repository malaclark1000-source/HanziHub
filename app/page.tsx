import { redirect } from 'next/navigation'

// The deck library is the site's landing page.
export default function Home() {
  redirect('/decks')
}
