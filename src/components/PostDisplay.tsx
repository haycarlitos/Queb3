import { FC } from 'react'
import Link from 'next/link'
import { Post } from '@/generated/types'
import MirrorButton from './MirrorButton'
import { format as timeago } from 'timeago.js'
import VerifiedIcon from './Icons/VerifiedIcon'

const PostDisplay: FC<{
	post: Post & { link: string }
	onMirror: Function
	className?: string
	as?: string | FC
}> = ({ post, onMirror, className = '', as: Component = 'div' }) => {
	console.log('post: ', post);
	return (
		/* @ts-ignore */
		<Component key={post.id} className={`flex items-start space-x-3 ${className}`}>
			<div className="space-y-2">
				<p className="font-semibold text-white group-visited:text-[#999999] inline">{post.metadata.name}</p>
				<p className="text-white/60 text-sm">
					<span>
						by{' '}
					</span>
					<a
						href={`https://open.withlens.app/profile/${post.profile.handle}`}
						target="_blank"
						className="hover:underline inline-flex items-center space-x-1"
						rel="noreferrer"
					>
						<span>{post.profile.handle}</span>
						{post.profile.onChainIdentity.worldcoin.isHuman && <VerifiedIcon className="w-3 h-3" />}
					</a>
					<span className="mx-1.5">·</span>
					<a>{timeago(post.createdAt)}</a>
					<span className="mx-1.5">·</span>
					<Link href={`/posts/${post.id}`}>
						<a className="hover:underline">
							{post.stats.totalAmountOfComments}{' '}
							{post.stats.totalAmountOfComments == 1 ? 'answer' : 'answers'}
						</a>
					</Link>
					<span className="mx-1.5">·</span>
					<Link href={`/posts/${post.id}`}>
						<a className="hover:underline">
						✍️ ANSWER
						</a>
					</Link>
				</p>
			</div>
		</Component>
	)
}

export default PostDisplay
