import Link from 'next/link'
import HeaderLink from './HeaderLink'
import PostDisplay from './PostDisplay'
import { Post } from '@/generated/types'
import urlRegexSafe from 'url-regex-safe'
import { useQuery } from '@apollo/client'
import { FC, useMemo, useState } from 'react'
import { useProfile } from '@/context/ProfileContext'
import EXPLORE_PUBLICATIONS from '@/graphql/explore/explorePublications'

type SortCriteria = 'TOP_MIRRORED' | 'TOP_COMMENTED' | 'LATEST'

const LinksPage: FC<{ sortCriteria?: SortCriteria }> = ({ sortCriteria = 'TOP_MIRRORED' }) => {
	const { profile } = useProfile()
	const [extraUpvotes, setExtraUpvotes] = useState<Record<string, number>>({})

	const { data, loading, error } = useQuery<{ explorePublications: { items: Post[] } }>(EXPLORE_PUBLICATIONS, {
		variables: { sortCriteria, profileId: profile?.id },
	})

	const links = useMemo(() => {
		if (!data) return

		return data.explorePublications.items
			.map(post => {
				const link = post.metadata.content.match(urlRegexSafe())?.pop()
				return {
					...post,
					stats: {
						...post.stats,
						totalAmountOfMirrors: post.stats.totalAmountOfMirrors + (extraUpvotes?.[post.id] ?? 0),
					},
					link: !link ? null : link.startsWith('http') ? link : `https://${link}`,
				}
			})
			.filter(post => post.link)
			.sort((a, b) => {
				if (sortCriteria == 'LATEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				if (sortCriteria == 'TOP_MIRRORED') return b.stats.totalAmountOfMirrors - a.stats.totalAmountOfMirrors
			})
	}, [data, extraUpvotes, sortCriteria])

	return (
		<>
			<h2 className="my-4 text-2xl font-medium">{sortCriteria == 'LATEST' ? 'Newest' : 'Trending'}</h2>
			<div className="flex md:hidden items-center space-x-4">
				<HeaderLink href="/">Trending</HeaderLink>
				<HeaderLink href="/newest">Newest</HeaderLink>
				<HeaderLink href="/create">Ask</HeaderLink>
			</div>
			{!loading && !error && links?.length == 0 && (
				<div className="flex items-center justify-center pt-12">
					<p className="text-white/60">
						No questions yet!{' '}
						<Link href="/create">
							<a className="underline">Wanna be the first?</a>
						</Link>
					</p>
				</div>
			)}
			{loading && (
				<div className="flex items-center justify-center pt-12">
					<p className="text-white/60">Loading...</p>
				</div>
			)}
			<ul id="posts" className="space-y-12 pb-6">
				{links &&
					links.map(link => (
						<PostDisplay
							as="li"
							post={link}
							key={link.id}
							onMirror={() => setExtraUpvotes(extras => ({ ...extras, [link.id]: 1 }))}
						/>
					))}
			</ul>
		</>
	)
}

export default LinksPage
