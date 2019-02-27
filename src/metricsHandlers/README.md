# Usage metrics

For purposes of improving the tools we provide our users, we track some metrics about how the laboratory is used. We use Amplitude to do so, and data is completely anonymous. Below is a list of what events and properties are collected for each feature.

## Page navigation

* changed page
  * path

## Network picker

* changed horizon url
  * horizonUrl

## Account creator

* generated new account
  * (no properties)
* funded test account: start
  * (no properties)
* funded test account: success
  * (no properties)
* funded test account: failure
  * message
  * code

## Endpoint Explorer

* changed resource
  * resource
* changed endpoint
  * resource
  * endpoint
* request: start
  * template
  * resource
  * endpoint
* request: success
  * template
  * resource
  * endpoint
* request: stream message
  * template
  * resource
  * endpoint
* request: failed
  * detail
  * extras
  * status

## Transaction builder

* changed operation type
  * type
* added operation
  * (no properties)
* removed operation
  * (no properties)
* began signing transaction
  * operations
* view XDR
  * operations

## Transaction signer

* ledger signature: begin
  * (no properties)
* ledger signature: success
  * (no properties)
* ledger signature: failed
  * error
* add secret
  * secretCount
* begin submitting transaction
  * (no properties)
* view signed XDR envelope
  * (no properties)

## XDR viewer

* fetch latest transaction
  * (no properties)
* decode XDR: failed
  * type
* decode XDR: success
  * type
