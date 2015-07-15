var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')

describe('lib/commands/resolve-service', function () {
  var resolveService
  var resolveLocation
  var cache

  beforeEach(function () {
    resolveLocation = sinon.stub()
    cache = {}

    resolveService = proxyquire('../../../lib/commands/resolve-service', {
      './resolve-location': resolveLocation,
      '../cache': cache
    })
  })

  it('should ignore invalid arguments', function () {
    resolveService(null)

    expect(Object.keys(cache)).to.be.empty
  })

  it('should ignore non-expired advert', function () {
    var service = {
      expires: Date.now() + 10
    }

    cache['usn'] = service

    resolveService({}, 'usn', 'st', 'location', 'ttl')

    expect(cache['usn']).to.equal(service)
  })

  it('should emit error when resolving location fails', function () {
    var error = new Error('Urk!')
    resolveLocation.callsArgWith(1, error)

    var ssdp = {
      emit: sinon.stub()
    }

    resolveService(ssdp, 'usn', 'st', 'location', 'ttl')

    expect(ssdp.emit.calledWith('error', error)).to.be.true
  })
})
