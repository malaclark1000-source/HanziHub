import { Metadata } from 'next'

// Page title (and description) for this section; the pages themselves are
// client components, which can't export metadata.
export const metadata: Metadata = {
  title: 'Pleco Decks',
  description: 'Download free Pleco flashcard lists for DLI Mandarin students.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
