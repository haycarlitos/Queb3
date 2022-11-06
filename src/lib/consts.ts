export const APP_NAME = 'Queb3'
export const ERROR_MESSAGE = 'Something went wrong! Please try again'

//export const IS_MAINNET = process.env.NODE_ENV === 'production'
export const IS_MAINNET = true
export const API_URL = IS_MAINNET ? 'https://api.lens.dev' : 'https://api-mumbai.lens.dev'
export const LENSHUB_PROXY = IS_MAINNET
	? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
	: '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'

export const RELAYER_HOSTS = ['http://localhost:4783', 'https://queb3.vercel.app/']
export const RELAYER_ON = RELAYER_HOSTS.includes(process.env.NEXT_PUBLIC_URL)
