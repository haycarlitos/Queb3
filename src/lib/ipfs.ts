import { create } from 'ipfs-http-client'

const auth = 'Basic ' + Buffer.from('2FdQuHpYUPHgr4xdrOEAmzQ40zI' + ':' + '39e1d7527cb7d2d6fc0c954b37dba8df').toString('base64');

const client = create({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
        authorization: auth,
    },
})

const uploadToIPFS = async <T>(data: T): Promise<string> => {
	const result = await client.add(JSON.stringify(data))

	return result.path
}

export default uploadToIPFS
