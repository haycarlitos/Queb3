import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import uploadToIPFS from '@/lib/ipfs'
import Input from '@/components/Input'
import { toastOn } from '@/lib/toasts'
import { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import HeaderLink from '@/components/HeaderLink'
import LensHubProxy from '@/abis/LensHubProxy.json'
import { useProfile } from '@/context/ProfileContext'
import { omit, trimIndentedSpaces } from '@/lib/utils'
import BROADCAST_MUTATION from '@/graphql/broadcast/broadcast'
import { ERROR_MESSAGE, LENSHUB_PROXY, RELAYER_ON } from '@/lib/consts'
import CREATE_ASK_SIG from '@/graphql/publications/create-ask-typed-data'
import { CreateAskBroadcastItemResult, RelayResult } from '@/generated/types'
import { useAccount, useContractWrite, useNetwork, useSignTypedData } from 'wagmi'

const Ask = () => {
	const { profile } = useProfile()
	const { address } = useAccount()
	const { chain } = useNetwork()

	const [getTypedData, { loading: dataLoading }] = useMutation<{
		CreateAskTypedData: CreateAskBroadcastItemResult
	}>(CREATE_ASK_SIG, {
		onError: error => toast.error(error.message ?? ERROR_MESSAGE),
	})
	const { signTypedDataAsync: signRequest, isLoading: sigLoading } = useSignTypedData({
		onError: error => {
			toast.error(error.message ?? ERROR_MESSAGE)
		},
	})

	const { writeAsync: sendTx, isLoading: txLoading } = useContractWrite({
		mode: 'recklesslyUnprepared',
		addressOrName: LENSHUB_PROXY,
		contractInterface: LensHubProxy,
		functionName: 'postWithSig',
		onError(error: any) {
			toast.error(error?.data?.message ?? error?.message)
		},
		onSuccess() {
			setQuestion('')
		},
	})
	const [broadcast, { loading: gasslessLoading }] = useMutation<{ broadcast: RelayResult }>(BROADCAST_MUTATION, {
		onCompleted({ broadcast }) {
			if ('reason' in broadcast) return

			setQuestion('')
		},
		onError() {
			toast.error(ERROR_MESSAGE)
		},
	})

	const [question, setQuestion] = useState<string>('')

	const createAsk = async event => {
		event.preventDefault()
		if (!address) return toast.error('Please connect your wallet first.')
		if (chain?.unsupported) return toast.error('Please change your network.')
		if (!profile) return toast.error('Please create a Lens profile first.')

		const { id, typedData } = await toastOn(
			async () => {
				const ipfsCID = await uploadToIPFS({
					version: '1.0.0',
					metadata_id: uuidv4(),
					external_url: null,
					image: null,
					imageMimeType: null,
					name: question,
					attributes: [
						{
							traitType: 'string',
							key: 'type',
							value: 'post',
						},
					],
					media: [],
					appId: 'refract',
				})

				const {
					data: { CreateAskTypedData },
				} = await getTypedData({
					variables: {
						request: {
							profileId: profile.id,
							contentURI: `ipfs://${ipfsCID}`,
							collectModule: {
								freeCollectModule: {
									followerOnly: false,
								},
							},
						},
					},
				})

				return CreateAskTypedData
			},
			{
				loading: 'Getting signature details...',
				success: 'Signature is ready!',
				error: 'Something went wrong! Please try again later',
			}
		)

		const {
			profileId,
			contentURI,
			collectModule,
			collectModuleInitData,
			referenceModule,
			referenceModuleInitData,
			deadline,
		} = typedData.value

		const signature = await signRequest({
			domain: omit(typedData?.domain, '__typename'),
			types: omit(typedData?.types, '__typename'),
			value: omit(typedData?.value, '__typename'),
		})
		const { v, r, s } = ethers.utils.splitSignature(signature)

		if (RELAYER_ON) {
			return toastOn(
				async () => {
					const {
						data: { broadcast: result },
					} = await broadcast({
						variables: {
							request: { id, signature },
						},
					})

					if ('reason' in result) throw result.reason
				},
				{ loading: 'Sending transaction...', success: 'Transaction sent!', error: ERROR_MESSAGE }
			)
		}

		await toastOn(
			() =>
				sendTx({
					recklesslySetUnpreparedArgs: {
						profileId,
						contentURI,
						collectModule,
						collectModuleInitData,
						referenceModule,
						referenceModuleInitData,
						sig: { v, r, s, deadline },
					},
				}),
			{ loading: 'Sending transaction...', success: 'Transaction sent!', error: ERROR_MESSAGE }
		)
	}

	const isLoading = useMemo(
		() => dataLoading || sigLoading || txLoading || gasslessLoading,
		[dataLoading, sigLoading, txLoading, gasslessLoading]
	)

	return (
		<>
			<div className="my-4 space-y-2">
				<h2 className="text-2xl font-medium">Ask</h2>
				<p className="text-white/40">Share your Qs with ppl who get you</p>
			</div>
			<div className="flex md:hidden items-center space-x-4">
				<HeaderLink href="/">Trending</HeaderLink>
				<HeaderLink href="/newest">Newest</HeaderLink>
				<HeaderLink href="/Ask">Ask</HeaderLink>
			</div>
			<form onSubmit={createAsk} className="pt-12 space-y-6">
				<Input
					label="Question"
					placeholder="We're here to listen & help"
					required
					value={question}
					onChange={setQuestion}
				/>
				<button
					disabled={isLoading}
					type="submit"
					className={`px-4 rounded-xl font-medium h-9 bg-white text-black disabled:cursor-wait`}
				>
				Ask	
				</button>
			</form>
		</>
	)
}

export default Ask
