import { Metadata } from 'next'

// Page title (and description) for this section; the pages themselves are
// client components, which can't export metadata.
export const metadata: Metadata = {
  title: 'External Tools',
  description: 'Study tools and apps recommended by DLI Mandarin students.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
