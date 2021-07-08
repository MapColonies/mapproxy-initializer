# Map Colonies Mapproxy Initializer


A job that retrieves a mapproxy configuration file (mapproxy.yaml) and deliver it to mapproxy. 

## Environment Variables
#### Global Environment Variables
- `OPENAPI_FILE_PATH`
- `LOG_LEVEL`
#### Service Specific
- `CONFIG_PROVIDER` - fs (file system) | s3 | db
- `SOURCE_FILE_PATH` - location of source file to copy from, only use for when working against FS.
- `DESTIONATION_FILE_PATH` - location of target file (the folder in which we save the retrieved file).
#### S3 (if working against s3)
- `S3_ENDPOINT` 
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `S3_FILE_KEY` - the name of the file in the s3 bucket to be downloaded.
- `S3_FORCE_PATH_STYLE`

#### DB (if working against DB)
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_PORT`
- `DB_SSL_ENABLED` - if DB has SSL configured
- `DB_REJECT_UNAUTHORIZED`
- `DB_SSL_PATH_CA` - path of CA file (SSL)
- `DB_SSL_PATH_KEY` - path of KEY file (SSL)
- `DB_SSL_PATH_CERT` - path of CERT file (SSL)