import chai from 'chai'
const assert = chai.assert;
import aglFetch from '../src/content-fetch.js'

describe('Api', function() {
    it('should be able to retrieve a content item', function(done) {
        
        var api = aglFetch.getApi({
            instanceID: '1234-1234',
            accessToken: 'fEpTcRnWO3EahHbojDCeY3PwGwAzpw2gveDuPn2l0nuqFbQYVcWrQ+a3/DHcWgCgn7UL2tgbSOS0AqrEOiXkTg==',
            languageCode: 'en-us'
        })

        api.getContentItem({
            contentID: 22
        })
        .then(function(contentItem) {
            assert.strictEqual(contentItem.contentID, 22);
            done();
        })
        .catch(done);
    })
})