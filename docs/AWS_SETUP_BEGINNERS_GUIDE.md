# AWS S3セットアップ 初心者向け完全ガイド

このガイドでは、AWSアカウントの作成からS3バケットの設定まで、初心者の方でもわかるように詳しく説明します。

## 📋 目次
1. [AWSアカウントの作成](#1-awsアカウントの作成)
2. [AWSマネジメントコンソールへのログイン](#2-awsマネジメントコンソールへのログイン)
3. [S3バケットの作成](#3-s3バケットの作成)
4. [IAMユーザーの作成](#4-iamユーザーの作成)
5. [アクセスキーの取得](#5-アクセスキーの取得)
6. [CloudFrontの設定（オプション）](#6-cloudfrontの設定オプション)
7. [環境変数の設定](#7-環境変数の設定)

---

## 1. AWSアカウントの作成

### 1.1 AWSサインアップページにアクセス
1. ブラウザで [https://aws.amazon.com/jp/](https://aws.amazon.com/jp/) にアクセス
2. 右上の「AWSアカウントを作成」ボタンをクリック

### 1.2 アカウント情報の入力
1. **ルートユーザーのEメールアドレス**: 普段使用しているメールアドレスを入力
2. **AWSアカウント名**: 「長瀬サロン」などわかりやすい名前を入力
3. 「続行」をクリック

### 1.3 連絡先情報の入力
1. **アカウントタイプ**: 「個人」を選択
2. **氏名**: あなたの本名を入力
3. **電話番号**: 携帯電話番号を入力（SMS認証で使用）
4. **住所**: 正確な住所を入力
5. 利用規約に同意して「続行」をクリック

### 1.4 支払い情報の入力
1. **クレジットカード情報**: 有効なクレジットカードを入力
   - 💡 **注意**: 今回の設定では月額数百円程度の費用しかかかりません
2. 「続行」をクリック

### 1.5 電話番号の確認
1. **認証方法**: 「テキストメッセージ（SMS）」を選択
2. **セキュリティチェック**: 表示された文字を入力
3. 「SMSを送信」をクリック
4. 受信したSMSの認証コードを入力

### 1.6 サポートプランの選択
1. **ベーシックサポート**: 「無料」を選択（今回は十分です）
2. 「サインアップを完了」をクリック

**🎉 完了！** アカウント作成完了のメールが届きます。

---

## 2. AWSマネジメントコンソールへのログイン

### 2.1 ログインページにアクセス
1. [https://console.aws.amazon.com/](https://console.aws.amazon.com/) にアクセス
2. 「ルートユーザー」を選択
3. 作成時に登録したメールアドレスを入力
4. 「次へ」をクリック

### 2.2 パスワード入力
1. アカウント作成時に設定したパスワードを入力
2. 「サインイン」をクリック

### 2.3 リージョンの確認
画面右上でリージョンが **「アジアパシフィック（東京）ap-northeast-1」** になっていることを確認してください。

![AWS Console Region](images/aws-console-region.png)

---

## 3. S3バケットの作成

### 3.1 S3サービスにアクセス
1. AWSマネジメントコンソール上部の「サービス」をクリック
2. 検索ボックスに「S3」と入力
3. 「S3」をクリック

![S3 Service Selection](images/s3-service-selection.png)

### 3.2 バケットの作成
1. オレンジ色の「バケットを作成」ボタンをクリック

![Create S3 Bucket](images/create-s3-bucket.png)

### 3.3 バケット設定
#### 基本設定
1. **バケット名**: `nagase-salon-data-20240101` のように入力
   - 💡 **重要**: バケット名は世界中で一意である必要があります
   - 日付や番号を追加して重複を避けてください
2. **AWSリージョン**: 「アジアパシフィック（東京）ap-northeast-1」を確認

![S3 Bucket Basic Settings](images/s3-bucket-basic.png)

#### パブリックアクセス設定
1. **パブリックアクセスをブロック** セクションを見つける
2. **「パブリックアクセスをすべてブロック」のチェックを外す**
   - ⚠️ **重要**: JSONファイルをウェブサイトから読み取るために必要です

![S3 Public Access Settings](images/s3-public-access.png)

3. 警告が表示されたら「承諾する」をチェック

#### その他の設定
1. **バケットのバージョニング**: 「無効にする」のまま
2. **デフォルト暗号化**: デフォルトのまま
3. 「バケットを作成」をクリック

**🎉 完了！** S3バケットが作成されました。

### 3.4 CORS設定の追加
1. 作成したバケットをクリック
2. 「アクセス許可」タブをクリック
3. 「Cross-origin resource sharing (CORS)」セクションまでスクロール
4. 「編集」ボタンをクリック

![S3 CORS Settings](images/s3-cors-settings.png)

5. 以下のJSONを貼り付け：

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://yourdomain.com",
            "https://*.vercel.app"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ]
    }
]
```

6. 「変更の保存」をクリック

---

## 4. IAMユーザーの作成

### 4.1 IAMサービスにアクセス
1. AWSマネジメントコンソール上部の「サービス」をクリック
2. 検索ボックスに「IAM」と入力
3. 「IAM」をクリック

![IAM Service Selection](images/iam-service-selection.png)

### 4.2 ユーザーの作成
1. 左側メニューの「ユーザー」をクリック
2. オレンジ色の「ユーザーを作成」ボタンをクリック

![Create IAM User](images/create-iam-user.png)

### 4.3 ユーザー詳細の設定
1. **ユーザー名**: `nagase-salon-s3-user` と入力
2. 「次へ」をクリック

![IAM User Details](images/iam-user-details.png)

### 4.4 許可の設定
1. **許可を設定**: 「ポリシーを直接アタッチする」を選択
2. 「ポリシーの作成」をクリック（新しいタブが開きます）

![IAM User Permissions](images/iam-user-permissions.png)

### 4.5 ポリシーの作成
新しいタブで：

1. **JSON**タブをクリック
2. 既存のコードを削除して、以下をコピー＆ペースト：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::あなたのバケット名/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::あなたのバケット名"
        }
    ]
}
```

3. **重要**: `あなたのバケット名` を実際に作成したバケット名に変更
4. 「次へ」をクリック

![IAM Policy JSON](images/iam-policy-json.png)

### 4.6 ポリシーの名前設定
1. **ポリシー名**: `NagaseSalonS3Policy` と入力
2. **説明**: `長瀬サロンのS3アクセス用ポリシー` と入力
3. 「ポリシーの作成」をクリック

![IAM Policy Name](images/iam-policy-name.png)

### 4.7 ユーザーにポリシーをアタッチ
元のタブに戻って：

1. 🔄 ページを更新（リロード）
2. 検索ボックスに `NagaseSalonS3Policy` と入力
3. 作成したポリシーにチェック
4. 「次へ」をクリック
5. 「ユーザーの作成」をクリック

![Attach Policy to User](images/attach-policy-user.png)

**🎉 完了！** IAMユーザーが作成されました。

---

## 5. アクセスキーの取得

### 5.1 作成したユーザーを選択
1. ユーザー一覧で `nagase-salon-s3-user` をクリック

![Select IAM User](images/select-iam-user.png)

### 5.2 アクセスキーの作成
1. 「セキュリティ認証情報」タブをクリック
2. 「アクセスキーを作成」をクリック

![Create Access Key](images/create-access-key.png)

### 5.3 使用事例の選択
1. **「ローカルコード」** を選択
2. 下部の確認チェックボックスにチェック
3. 「次へ」をクリック

![Access Key Use Case](images/access-key-usecase.png)

### 5.4 説明タグ（オプション）
1. **説明タグ**: `長瀬サロンWebサイト用` と入力（任意）
2. 「アクセスキーを作成」をクリック

### 5.5 アクセスキーの保存
**⚠️ 重要**: この画面は一度しか表示されません！

![Access Key Created](images/access-key-created.png)

1. **アクセスキーID**: コピーしてメモ帳に保存
2. **シークレットアクセスキー**: 「表示」をクリックしてコピー、メモ帳に保存
3. または「.csvファイルをダウンロード」をクリックして保存

**例**:
```
アクセスキーID: AKIAIOSFODNN7EXAMPLE
シークレットアクセスキー: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

4. 「完了」をクリック

---

## 6. CloudFrontの設定（オプション）

CloudFrontを設定すると、データの読み込みが高速化されます。

### 6.1 CloudFrontサービスにアクセス
1. AWSマネジメントコンソール上部の「サービス」をクリック
2. 検索ボックスに「CloudFront」と入力
3. 「CloudFront」をクリック

### 6.2 ディストリビューションの作成
1. 「ディストリビューションを作成」をクリック
2. **オリジンドメイン**: S3バケットを選択
3. **オリジンアクセス**: 「Origin access control settings (recommended)」を選択
4. 「オリジンアクセスコントロールを作成」をクリック
5. デフォルト設定のまま「作成」をクリック

### 6.3 キャッシュ設定
1. **キャッシュポリシー**: 「Managed-CachingOptimized」を選択
2. その他はデフォルトのまま
3. 「ディストリビューションを作成」をクリック

### 6.4 ドメイン名の取得
1. 作成されたディストリビューションをクリック
2. **ディストリビューションドメイン名**をコピー
   - 例: `d1234567890123.cloudfront.net`

---

## 7. 環境変数の設定

### 7.1 .env.localファイルの作成
プロジェクトのルートフォルダ（package.jsonがある場所）で：

1. **Windowsの場合**: 
   - メモ帳を開く
   - 新しいファイルを作成
   - 名前を付けて保存で `.env.local` と入力

2. **Macの場合**:
   - ターミナルを開く
   - プロジェクトフォルダに移動
   - `touch .env.local` を実行

### 7.2 環境変数の記入
`.env.local` ファイルに以下を記入：

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=ここに先ほどコピーしたアクセスキーIDを入力
AWS_SECRET_ACCESS_KEY=ここに先ほどコピーしたシークレットアクセスキーを入力
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=ここに作成したバケット名を入力

# CloudFront (設定した場合のみ)
AWS_CLOUDFRONT_DOMAIN=ここにCloudFrontのドメイン名を入力
```

**実際の例**:
```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=nagase-salon-data-20240101

# CloudFront
AWS_CLOUDFRONT_DOMAIN=d1234567890123.cloudfront.net
```

### 7.3 ファイルの保存
1. ファイルを保存
2. ⚠️ **重要**: `.env.local` ファイルは絶対に他人に見せないでください

---

## 8. 動作確認

### 8.1 データのアップロード
ターミナル（コマンドプロンプト）でプロジェクトフォルダに移動して：

```bash
npm run s3:setup
```

### 8.2 データの検証
```bash
npm run s3:validate
```

成功すると以下のような出力が表示されます：
```
🎉 All data validation passed!
```

---

## 🆘 トラブルシューティング

### よくあるエラーと解決方法

#### 1. 「AccessDenied」エラー
**原因**: IAMポリシーの設定が間違っている
**解決**: ポリシーのバケット名を確認

#### 2. 「InvalidBucketName」エラー
**原因**: バケット名が既に使用されている
**解決**: 別のバケット名で再作成

#### 3. 「CredentialsError」エラー
**原因**: アクセスキーの設定が間違っている
**解決**: `.env.local`ファイルの内容を確認

#### 4. 「RegionMismatch」エラー
**原因**: リージョンの設定が間違っている
**解決**: すべてを「ap-northeast-1」に統一

---

## 📞 サポート

問題が解決しない場合は、以下の情報をまとめてお知らせください：

1. エラーメッセージの全文
2. 設定したバケット名
3. 実行したコマンド
4. 使用しているOS（Windows/Mac）

---

**🎉 お疲れさまでした！** 

これでAWS S3の設定が完了しました。プロジェクトがS3のデータを使用してWebサイトが表示されるようになります。