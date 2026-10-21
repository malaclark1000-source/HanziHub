import { Metadata } from 'next'

// Page title (and description) for this section; the pages themselves are
// client components, which can't export metadata.
export const metadata: Metadata = {
  title: 'Anki Tutorial',
  description: 'A complete guide to studying Mandarin with Anki at DLI.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
