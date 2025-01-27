const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t text-center text-xs text-gray-500 py-2 md:py-3">
            &copy; Goran Kitic | Electron {currentYear}.
        </footer>
    )
}
export default Footer;