# BOSH release for Hyperledger
This repository is BOSH release for [hyperledger fabric](https://github.com/hyperledger/fabric).

## Deployment

1. Install and start [Bosh lite](https://github.com/cloudfoundry/bosh-lite) 
1. Upload stemcell

	```
	bosh upload stemcell https://bosh.io/d/stemcells/bosh-warden-boshlite-ubuntu-trusty-go_agent
	```

1. Fetch release repo

	```
	mkdir -p ~/workspace
	cd ~/workspace
	git clone https://github.com/atulkc/fabric-release.git
	cd fabric-release/
	```

1. Run following command to build and upload bosh release

	```
	bosh create release && bosh upload release
	```

1. Update cloud config on bosh director

	```
	bosh update cloud-config manifests/cloud_config_boshlite.yml
	```

1. Deploy release

	```
	bosh -d manifests/fabric.yml deploy
	```

## Test

1. Deploy a chaincode

	```
	curl -X POST 10.244.8.3:5000/chaincode -d '{
		"jsonrpc": "2.0",
		"method": "deploy",
		"params": {
			"type": 1,
			"chaincodeID":{
				"path":"https://github.com/atulkc/chaincode_example/chaincode_example01"
			},
			"ctorMsg": {
				"function":"init",
				"args":["c", "450", "d", "700"]
			}
		},
		"id": 1
	}'
	```

	Response:
	```
	{"jsonrpc":"2.0","result":{"status":"OK","message":"<message-id>"},"id":1}
	```

1. Verify that the chaincode was deployed successfuly

	```
	curl -X POST 10.244.9.2:5000/chaincode -d '
	{
		"jsonrpc": "2.0",
		"method": "query",
		"params": {
			"type": 1,
			"chaincodeID":{
				"name":"<message-id>"
			},
			"ctorMsg": {
				"function":"query",
				"args":["c"]
			}
		},
		"id": 2
	}'
	```

	Response:
	```
	{"jsonrpc":"2.0","result":{"status":"OK","message":"450"},"id":2}
	```

1. Initiate a transaction against deployed chaincode

	```
	curl -X POST 10.244.8.2:5000/chaincode -d '
	{
		"jsonrpc": "2.0",
		"method": "invoke",
		"params": {
			"type": 1,
			"chaincodeID":{
				"name":"<message-id>"
			},
			"ctorMsg": {
				"function":"invoke",
				"args":["d", "c", "10"]
			}
		},
		"id": 3
	}'
	```

	Response:
	```
	{"jsonrpc":"2.0","result":{"status":"OK","message":"<transaction-id>"},"id":3}
	```

1. Verify that the transaction to chaincode was executed

	```
	curl -X POST 10.244.9.2:5000/chaincode -d '
	{
		"jsonrpc": "2.0",
		"method": "query",
		"params": {
			"type": 1,
			"chaincodeID":{
				"name":"<message-id>"
			},
			"ctorMsg": {
				"function":"query",
				"args":["c"]
			}
		},
		"id": 4
	}'
	```

	Response:
	```
	{"jsonrpc":"2.0","result":{"status":"OK","message":"470"},"id":4}
	```

