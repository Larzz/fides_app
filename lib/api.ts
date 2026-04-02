/**
 * API configuration (re-exports).
 * Prefer `getServerApiBaseUrl` on the server and `getPublicApiBaseUrl` in
 * client components.
 */

export {
	getServerApiBaseUrl,
	getPublicApiBaseUrl,
	serverApiUrl,
} from './api-config'

/** @deprecated Use getServerApiBaseUrl */
export { getServerApiBaseUrl as getApiUrl } from './api-config'
