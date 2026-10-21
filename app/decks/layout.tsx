import { Metadata } from 'next'

// Page title (and description) for this section; the pages themselves are
// client components, which can't export metadata.
export const metadata: Metadata = {
  title: 'Anki Decks',
  description: 'Download free Anki decks for DLI Mandarin students.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
