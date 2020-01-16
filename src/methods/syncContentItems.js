import { buildRequestUrlPath, buildAuthHeader } from '../utils'

/**
 * Sync content based on the most recent version id that has been synced.
 * @memberof AgilityFetch.Client
 * @param {Object} requestParams - The paramters for the API request.
 * @param {number} requestParams.ticks - The ticks value from the most recently synced content item in this language.
 * @param {string} requestParams.languageCode - The language code of the content you want to retrieve.
 * @param {number} [requestParams.pageSize] - The number of items to return back with each call.  Default is 1000.
 * @returns {Promise<{Array.<AgilityFetch.Types.ContentItem>}>} - Returns a list of content item objects.
*/
function syncContentItems(requestParams) {

    validateRequestParams(requestParams);

    const req = {
        url: `/sync/items?pageSize=${requestParams.pageSize}&ticks=${requestParams.ticks}`,
        method: 'get',
        baseURL: buildRequestUrlPath(this.config, requestParams.languageCode),
        headers: buildAuthHeader(this.config),
        params: {}
    };

    return this.makeRequest(req);
}

function validateRequestParams(requestParams) {
    if (!requestParams.languageCode) {
        throw new TypeError('You must include a languageCode in your request params.')
    }
    else if (requestParams.ticks == undefined || requestParams.ticks == null) {
        throw new TypeError('You must include a ticks value your request params.  Use zero (0) to start a new sync.');
    } else {
        return;
    }
}


export default syncContentItems;