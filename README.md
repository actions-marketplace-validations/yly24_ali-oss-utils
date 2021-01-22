
# Upload to OSS

上传单个文件或文件夹所有文件到 OSS

## Inputs

- `access-key-id`: OSS AccessKeyId
- `access-key-secret`: OSS AccessKeySecret
- `region`: 区域，如 `oss-cn-shenzhen`
- `bucket`:
- `source`: 本地资源路径
- `target`: OSS 对象存储路径

## Outputs

- `url`: 文件在 OSS 上的 url。上传多个文件时，多个 url 用逗号隔开。

## Usage

```yaml
- name: Upload to oss
  id: upload_to_oss
  uses: yinlinyang/ali-oss-utils@1.0.1
  with:
    access-key-id: ${{ secrets.OSS_KEY_ID }}
    access-key-secret: ${{ secrets.OSS_KEY_SECRET }}
    region: oss-cn-shenzhen
    bucket: project
    source: /
    target: /
```
