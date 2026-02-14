const assert = require('assert');
const getLocations = require('../lib/locations');

describe('Locations', function() {
  describe('getLocations()', function() {
    it('should return an array', function() {
      const locations = getLocations();
      assert(Array.isArray(locations), 'locations should be an array');
    });

    it('should have at least one location', function() {
      const locations = getLocations();
      assert(locations.length > 0, 'should have at least one location');
    });

    it('should have required properties for each location', function() {
      const locations = getLocations();
      locations.forEach((location, index) => {
        assert(location.domain, `location ${index} should have domain`);
        assert(location.name, `location ${index} should have name`);
        assert(location.url, `location ${index} should have url`);
        assert(location.icon || location.icon2, `location ${index} should have an icon`);
      });
    });

    it('should have GitHub location', function() {
      const locations = getLocations();
      const github = locations.find(loc => loc.domain === 'github');
      assert(github, 'should include GitHub location');
      assert.strictEqual(github.name, 'GitHub');
    });

    it('should have Azure DevOps locations', function() {
      const locations = getLocations();
      const adoLocations = locations.filter(loc => loc.name.includes('ADO'));
      assert(adoLocations.length > 0, 'should have Azure DevOps locations');
    });

    it('should have valid URLs', function() {
      const locations = getLocations();
      locations.forEach((location) => {
        assert(location.url.startsWith('https://'), `${location.name} should have https URL`);
      });
    });
  });
});
