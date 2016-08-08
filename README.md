# BOSH release for Hyperledger
This repository is BOSH release for [hyperledger fabric](https://github.com/hyperledger/fabric).

To use this release follow following steps:

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
