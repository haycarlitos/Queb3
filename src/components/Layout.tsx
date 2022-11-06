import Header from './Header'
import Head from 'next/head'
import Image from 'next/image'
import bgImage from '@images/bg.png'
import iconImage from '@images/icon.png'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children }) => {
	const meta = {
		title: `A better Quora`,
		description: `Your crypto-friendly link board. Discover new projects, highlight interesting articles, and share new ideas. Curated by the community.`,
	}

	return (
		<>
			<Head>
				<title>{meta.title}</title>
				<meta name="title" content={meta.title} />
				<meta name="description" content={meta.description} />
				<link rel="icon" type="image/png" href={iconImage.src} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://twitter.com" />
				<meta property="og:title" content={meta.title} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:image" content={meta.image} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://twitter.com" />
				<meta property="twitter:title" content={meta.title} />
				<meta property="twitter:description" content={meta.description} />
				<meta property="twitter:image" content={meta.image} />
			</Head>
			<div className="text-white-bold min-h-screen">
				<div className="fixed inset-0 -z-10 h-screen">
					<Image src={bgImage} placeholder="blur" layout="fill" alt="" />
				</div>
				<Header />
				<main className="max-w-2xl mx-auto space-y-8 px-6 md:px-0">{children}</main>
				<Toaster position="bottom-right" />
			</div>
		</>
	)
}

export default Layout
