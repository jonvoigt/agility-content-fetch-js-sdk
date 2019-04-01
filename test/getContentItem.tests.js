import chai from 'chai'
const assert = chai.assert;
const expect = chai.expect;

import { createApiClient, createPreviewApiClient, createCachedApiClient } from './apiClients.config'

/* 
    This file contains static references to content from the instance configured in the apiClient.config file.
*/

const ref = {
    publishedContentItemID: 15,
    updatesMadeToPublishedContentItemID: 15
}

describe('getContentItem:', function() {

    this.timeout('120s');

    it('should retrieve a content item in live/fetch mode and only return published content', function(done) {
        var api = createApiClient();
        api.getContentItem({
            contentID: ref.updatesMadeToPublishedContentItemID,
            languageCode: 'en-us'
        })
        .then(function(contentItem) {
            assert.strictEqual(contentItem.contentID, ref.updatesMadeToPublishedContentItemID, 'retrieved content item we asked for');
            assert.notInclude(contentItem.fields.title, '[Staging]', 'title does not have staging content' );
            done();
        })
        .catch(done);
    })
    
    it('should retrieve a content item in preview mode and return the latest staging version', function(done) {
        var api = createPreviewApiClient();
        api.getContentItem({
            contentID: ref.updatesMadeToPublishedContentItemID,
            languageCode: 'en-us'
        })
        .then(function(contentItem) {
            assert.strictEqual(contentItem.contentID, ref.updatesMadeToPublishedContentItemID, 'retrieved content item we asked for');
            assert.include(contentItem.fields.title, '[Staging]', 'title includes staging content' );
            done();
        })
        .catch(done);
    })

    it('should retrieve a content item in live/fetch mode, then subsequent requests are returned from cache (memory)', function(done) {
        var api = createCachedApiClient();
        api.getContentItem({
            contentID: ref.updatesMadeToPublishedContentItemID,
            languageCode: 'en-us'
        })
        .then(function(contentItem) {
            assert.strictEqual(contentItem.contentID, ref.updatesMadeToPublishedContentItemID, 'retrieved content item we asked for');
            assert.notExists(contentItem.fromCache, 'content item should not be served from cache on first request')
            
            api.getContentItem({
                contentID: ref.updatesMadeToPublishedContentItemID,
                languageCode: 'en-us'
            })
            .then(function(contentItem2) {
                assert.strictEqual(contentItem2.contentID, ref.updatesMadeToPublishedContentItemID, 'retrieved content item we asked for');
                assert.strictEqual(contentItem2.fromCache, true, 'content item was retrieved from memory cache')
                done();
            })
            .catch(done)

        })
        .catch(done);
    })
    
    it('should throw error if contentID not passed as argument for getContentItem', function(done) {
        expect(function() {
            var api = createApiClient();
            api.getContentItem({
                someOtherParam: 22,
                languageCode: 'en-us'
            })
            .then(function(contentItem) {
                assert.strictEqual(contentItem.contentID, 22);
                done();
            })
            .catch(done);
        }).to.throw( TypeError );
        done();
    })
    
    it('should throw error if languageCode not passed as argument for getContentItem', function(done) {
        expect(function() {
            var api = createApiClient();
            api.getContentItem({
                contentID: 22
            })
            .then(function(contentItem) {
                assert.strictEqual(contentItem.contentID, 22);
                done();
            })
            .catch(done);
        }).to.throw( TypeError );
        done();
    })

});
