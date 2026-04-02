// Links used in our websites header
//

import Link from 'next/link'
import { usePathname } from 'next/navigation';


function HeaderLink({ linkRoute, linkName, isCurrentPage, isMobile }: { linkRoute: string, linkName: string, isCurrentPage: boolean; isMobile: boolean | undefined }) {

    var classString = ""

    if (isCurrentPage) {
        classString = isMobile ? 'text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-medium whitespace-nowrap' : 'text-blue-600 font-medium'
    } else {
        classString = isMobile ? 'text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 whitespace-nowrap' : 'text-slate-600 hover:text-slate-900'
    }

    return <Link href={`/${linkRoute}`} className={classString}>{linkName}</Link>
}

// Helper function to build our list of navigation links
const mkLinkTuple = (linkRoute: string, linkName: string) => {
    return {
        linkRoute: linkRoute,
        linkName: linkName
    }
}

const NAV_LINKS = [
    mkLinkTuple("decks", "Browse Decks"),
    mkLinkTuple("dashboard", "My Downloads"),
    mkLinkTuple("tutorials", "Tutorials"),
    mkLinkTuple("report-bug", "Report Bug")
]

// List of main navigation links to other pages
export function NavBar(isAdmin: boolean, isMobile: boolean | undefined) {

    // Get the current path.
    const pathName = usePathname()

    // Get the first segment (used to display _which_ page we are currently on)
    const currentPage = pathName.split('/').at(1)

    return <>
        {NAV_LINKS.map(linkTuple => (
            <HeaderLink
                key={linkTuple.linkRoute} // some js quirk
                linkRoute={linkTuple.linkRoute}
                linkName={linkTuple.linkName}
                isCurrentPage={currentPage === linkTuple.linkRoute}
                isMobile={isMobile}
            />
        ))}
        {isAdmin && <Link href="/admin" className={isMobile ? 'text-sm px-3 py-1.5 rounded-lg text-purple-600 hover:bg-purple-50 font-medium whitespace-nowrap' : 'text-purple-600 hover:text-purple-700 font-medium'}>Admin</Link>}
    </>
}
