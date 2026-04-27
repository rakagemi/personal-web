export function useActiveLink(pathname: string) {
    const isActive = (link: string) => {
        if (link === pathname) return true;
        if (link === "/about") return pathname.startsWith("/about");
        return false;
    };

    return isActive;
}