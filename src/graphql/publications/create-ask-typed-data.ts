import { gql } from '@apollo/client'

const CREATE_ASK_SIG = gql`
	mutation CreateAskTypedData($request: CreatePublicAskRequest!) {
		createAskTypedData(request: $request) {
			id
			expiresAt
			typedData {
				types {
					AskWithSig {
						name
						type
					}
				}
				domain {
					name
					chainId
					version
					verifyingContract
				}
				value {
					nonce
					deadline
					profileId
					contentURI
					collectModule
					collectModuleInitData
					referenceModule
					referenceModuleInitData
				}
			}
		}
	}
`

export default CREATE_ASK_SIG
