import Link from 'next/link'
import HeaderLink from './HeaderLink'
import ConnectWallet from './ConnectWallet'

const Header = () => {
	return (
		<header className="flex items-center justify-between px-6 h-16">
			<Link href="/">
				<a className="flex items-center space-x-2">
					<span className="font-bold">Queb3</span>
				</a>
			</Link>
			<div className="hidden md:flex items-center space-x-4">
				<HeaderLink href="/questions">Questions</HeaderLink>
				<HeaderLink href="/create">Ask</HeaderLink>
			</div>
			<ConnectWallet />
		</header>
	)
}

export default Header
