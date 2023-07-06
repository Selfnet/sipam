import { RequestParams, Api } from '@/types/api.ts';
import { SIPAMConfiguration } from '@/config.ts';

export default function apiFactory(config: SIPAMConfiguration) {
  function getToken(accessToken?: string | null | undefined): string {
    if (config.oidc) {
      // console.log(accessToken);
      // console.log(store.getters['AuthOIDC/oidcAccessToken']);
      return `OPENID  ${accessToken || ''}`;
    }
    return `Bearer ${accessToken || ''}`;
  }

  const getRequestHeaders = (accessToken: string | null | undefined): RequestParams => ({
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${getToken(accessToken)}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  return new Api(
    {
      baseUrl: config.apiURL,
      securityWorker: getRequestHeaders,
    },
  );
}
