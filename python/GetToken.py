from oauth2client.service_account import ServiceAccountCredentials

# https://www.magellanic-clouds.com/blocks/guide/create-gcp-service-account-key/
# https://qiita.com/shos0130/items/361d56c6b6e8b9464b2b

def _get_access_token():
  """Retrieve a valid access token that can be used to authorize requests.

  :return: Access token.
  """
  credentials = ServiceAccountCredentials.from_json_keyfile_name(
      'service-account.json', 'https://www.googleapis.com/auth/firebase.messaging')
  access_token_info = credentials.get_access_token()
  return access_token_info.access_token

print(_get_access_token())
