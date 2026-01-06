# Team Topologies Designer - 要件定義書

## 1. プロジェクト概要

**プロジェクト名**: Team Topologies Designer

**概要**: Team Topologiesの理論に基づいて、企業の組織構造を視覚的に設計・管理できるWebベースのダッシュボードアプリケーション

**バージョン**: 1.0.0

**作成日**: 2026-01-05

---

## 2. 背景と目的

### 2.1 背景
- Team Topologiesは、ソフトウェア開発組織の構造とインタラクションパターンを最適化するフレームワーク
- 従来、組織設計は文書やスプレッドシートで管理されることが多く、視覚的な理解が困難
- チーム間の関係性や認知負荷の可視化が不十分

### 2.2 目的
- **企業での組織設計**を主目的とした実用的なツールの提供
- Team Topologiesの概念を視覚的に表現し、組織設計の意思決定を支援
- Team APIの概念を活用した、構造化されたチーム情報管理
- 設計した組織構造のバージョン管理と共有を容易にする

---

## 3. ヒアリング結果サマリー

| 項目 | 選択内容 | 理由・補足 |
|------|----------|------------|
| **利用目的** | 企業での組織設計 | 実際の組織構造を設計・分析するツール |
| **編集UI** | ビジュアルエディタ | ドラッグ&ドロップによる直感的な操作 |
| **データ保存** | ファイル管理 | JSON/YAML形式での保存、バージョン管理・共有が容易 |
| **技術スタック** | React/Next.js | モダンで豊富なエコシステム |
| **チーム情報** | Team API準拠 | 構造化されたチーム情報管理 |

---

## 4. 機能要件

### 4.1 コア機能

#### 4.1.1 チーム管理機能
Team Topologiesで定義される4つのチームタイプをサポート:

1. **Stream-Aligned Team** (ストリームアラインドチーム)
   - 特定のビジネス価値の流れに沿ったチーム
   - 色: 青系

2. **Enabling Team** (イネーブリングチーム)
   - 他のチームの能力向上を支援するチーム
   - 色: 緑系

3. **Complicated-Subsystem Team** (複雑なサブシステムチーム)
   - 高度な専門知識が必要なサブシステムを担当
   - 色: 紫系

4. **Platform Team** (プラットフォームチーム)
   - 他のチームが利用する基盤を提供
   - 色: オレンジ系

#### 4.1.2 インタラクションモード
Team Topologiesで定義される3つのインタラクションモードをサポート:

1. **Collaboration** (コラボレーション)
   - 2つのチームが密接に協力して作業
   - 表現: 双方向の太い線

2. **X-as-a-Service** (X-as-a-Service)
   - あるチームが別のチームにサービスを提供
   - 表現: 単方向の矢印

3. **Facilitating** (ファシリテーティング)
   - あるチームが別のチームの障害を取り除く支援
   - 表現: 点線の矢印

#### 4.1.3 Team API情報管理
各チームについて、以下の情報を管理:

- **基本情報**
  - チーム名
  - チームタイプ
  - 説明/ミッション

- **Team API要素**
  - **コードリポジトリ**: 管理しているリポジトリのリスト
  - **提供サービス/API**: 他チームに提供しているサービス
  - **バージョニング**: APIバージョン情報
  - **パフォーマンス指標**: SLO/SLI
  - **依存関係**: 依存している他チームのサービス

- **組織情報**
  - メンバー数 (推奨: 5-9名)
  - 主要な技術スタック
  - 責任範囲/境界
  - タグ/ラベル

- **認知負荷指標** (オプション)
  - ドメインの複雑性
  - 技術的複雑性
  - 責任範囲の広さ

### 4.2 ビジュアルエディタ機能

#### 4.2.1 キャンバス機能
- **無限キャンバス**: パン・ズーム対応
- **グリッド表示**: スナップ機能
- **背景レイヤー**: 論理的なグルーピングのための背景色/境界線

#### 4.2.2 チーム操作
- **ドラッグ&ドロップ**: チームの配置・移動
- **サイズ調整**: チームボックスのリサイズ
- **選択・複数選択**: 複数チームの一括操作
- **削除・複製**: チームの削除と複製

#### 4.2.3 インタラクション操作
- **接続の作成**: チーム間をクリックで接続
- **インタラクションタイプ選択**: 3つのモードから選択
- **接続の削除**: 簡単な削除操作
- **ラベル追加**: 接続に説明を追加

#### 4.2.4 編集サポート機能
- **Undo/Redo**: 操作の取り消し・やり直し
- **自動レイアウト**: 階層的または円形レイアウトの自動生成
- **検索・フィルタ**: チーム名やタイプでの検索
- **ミニマップ**: 全体俯瞰用のミニマップ

### 4.3 データ管理機能

#### 4.3.1 保存・読込
- **JSON形式でのエクスポート**: 構造化されたデータ形式
- **YAML形式でのエクスポート**: 人間が読みやすい形式
- **CSV形式でのインポート・エクスポート**: スプレッドシート互換形式
  - Team API情報の一括管理に対応
  - 複数CSVファイル方式（teams.csv, services.csv, dependencies.csv, interactions.csv）
  - Excelやスプレッドシートでの編集が可能
  - 既存のHRシステムやツールからのデータ移行を容易に
- **ファイルからのインポート**: JSON/YAML/CSVファイルの読み込み
- **自動保存**: ブラウザのLocalStorageへの一時保存

#### 4.3.2 バージョン管理サポート
- **変更履歴の記録**: 変更日時と変更内容の記録
- **コメント機能**: 変更理由の記録
- **Git連携を想定した設計**: JSON/YAMLファイルをGitで管理可能

### 4.4 表示・可視化機能

#### 4.4.1 ビュー切り替え
- **グラフビュー**: ノード・エッジによる視覚化 (デフォルト)
- **リストビュー**: チーム一覧テーブル表示
- **マトリクスビュー**: チーム間の関係性をマトリクス表示

#### 4.4.2 ハイライト機能
- **チームタイプ別ハイライト**: 特定タイプのチームを強調
- **インタラクション別ハイライト**: 特定のインタラクションモードを強調
- **パス表示**: 選択したチーム間の依存パスを表示

### 4.5 出力・共有機能

#### 4.5.1 画像エクスポート
- **PNG形式**: ラスター画像として出力
- **SVG形式**: ベクター画像として出力
- **解像度指定**: 出力サイズのカスタマイズ

#### 4.5.2 ダイアグラムコード出力 (将来拡張)
- **Mermaid形式**: Markdown埋め込み可能
- **PlantUML形式**: ドキュメント生成ツール連携

---

## 5. 非機能要件

### 5.1 パフォーマンス
- **初期ロード**: 3秒以内
- **操作レスポンス**: 100ms以内 (60fps維持)
- **対応チーム数**: 100チームまでスムーズに動作

### 5.2 ユーザビリティ
- **学習コスト**: 初回利用者が30分以内に基本操作を習得可能
- **直感的UI**: Team Topologiesの知識がある人なら説明なしで使用可能
- **エラーハンドリング**: 分かりやすいエラーメッセージ

### 5.3 互換性
- **ブラウザ対応**: Chrome, Firefox, Safari, Edge (最新2バージョン)
- **画面サイズ**: 1280x720px以上を推奨
- **データ互換性**: JSON/YAMLフォーマットの下位互換性維持

### 5.4 セキュリティ
- **データの機密性**: ローカル保存が基本、外部送信なし
- **XSS対策**: ユーザー入力の適切なサニタイズ

---

## 6. データモデル

### 6.1 Team オブジェクト
```typescript
interface Team {
  id: string;
  name: string;
  type: 'stream-aligned' | 'enabling' | 'complicated-subsystem' | 'platform';
  description: string;

  // Team API
  teamAPI: {
    codeRepositories: string[];
    providedServices: Service[];
    dependencies: Dependency[];
    versioning: string;
    performance: {
      slo?: string;
      sli?: string;
    };
  };

  // Organization info
  memberCount: number;
  techStack: string[];
  responsibilities: string[];
  tags: string[];

  // Cognitive load (optional)
  cognitiveLoad?: {
    domain: number;      // 1-10
    technical: number;   // 1-10
    scope: number;       // 1-10
  };

  // Visual
  position: { x: number; y: number };
  size?: { width: number; height: number };
}
```

### 6.2 Interaction オブジェクト
```typescript
interface Interaction {
  id: string;
  sourceTeamId: string;
  targetTeamId: string;
  mode: 'collaboration' | 'x-as-a-service' | 'facilitating';
  description?: string;
  label?: string;
}
```

### 6.3 Topology オブジェクト (ルート)
```typescript
interface Topology {
  version: string;
  metadata: {
    name: string;
    description: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
  };
  teams: Team[];
  interactions: Interaction[];
}
```

### 6.4 CSVフォーマット仕様

Team API情報をCSV形式でインポート・エクスポートする際のフォーマット定義。
複数のCSVファイルに分割し、リレーショナルな構造で管理する。

#### 6.4.1 teams.csv
チームの基本情報を管理

| カラム名 | 型 | 必須 | 説明 | 例 |
|---------|-----|------|------|-----|
| id | string | ○ | チームID（一意） | team-001 |
| name | string | ○ | チーム名 | Payment Team |
| type | string | ○ | チームタイプ | stream-aligned |
| description | string | | チームの説明・ミッション | Handle payment processing |
| memberCount | number | | メンバー数 | 7 |
| techStack | string | | 技術スタック（セミコロン区切り） | TypeScript;React;Node.js |
| responsibilities | string | | 責任範囲（セミコロン区切り） | Payment API;Billing |
| tags | string | | タグ（セミコロン区切り） | critical;customer-facing |
| cognitiveLoad_domain | number | | ドメイン複雑性（1-10） | 7 |
| cognitiveLoad_technical | number | | 技術複雑性（1-10） | 6 |
| cognitiveLoad_scope | number | | 責任範囲の広さ（1-10） | 5 |
| position_x | number | | キャンバス上のX座標 | 100 |
| position_y | number | | キャンバス上のY座標 | 200 |

**チームタイプの値**:
- `stream-aligned`: Stream-Aligned Team
- `enabling`: Enabling Team
- `complicated-subsystem`: Complicated-Subsystem Team
- `platform`: Platform Team

#### 6.4.2 services.csv
各チームが提供するサービス・APIを管理

| カラム名 | 型 | 必須 | 説明 | 例 |
|---------|-----|------|------|-----|
| id | string | ○ | サービスID（一意） | svc-001 |
| teamId | string | ○ | 提供チームID（teams.csvのidに対応） | team-001 |
| name | string | ○ | サービス名 | Payment API |
| description | string | | サービスの説明 | REST API for payment processing |
| version | string | | APIバージョン | v2.1.0 |
| endpoint | string | | エンドポイントURL | /api/v2/payments |
| slo | string | | Service Level Objective | 99.9% uptime |
| sli | string | | Service Level Indicator | Response time < 200ms |

#### 6.4.3 dependencies.csv
チーム間の依存関係（あるチームが他チームのサービスに依存）を管理

| カラム名 | 型 | 必須 | 説明 | 例 |
|---------|-----|------|------|-----|
| id | string | ○ | 依存関係ID（一意） | dep-001 |
| consumerTeamId | string | ○ | 利用側チームID | team-001 |
| providerTeamId | string | ○ | 提供側チームID | team-002 |
| serviceId | string | | 利用しているサービスID（services.csvのid） | svc-002 |
| description | string | | 依存の詳細 | Uses authentication service |
| criticality | string | | 重要度 | high |

**重要度の値**:
- `low`: 低（障害時の影響が限定的）
- `medium`: 中（一部機能に影響）
- `high`: 高（主要機能が停止）
- `critical`: クリティカル（サービス全体が停止）

#### 6.4.4 interactions.csv
チーム間のインタラクションモードを管理

| カラム名 | 型 | 必須 | 説明 | 例 |
|---------|-----|------|------|-----|
| id | string | ○ | インタラクションID（一意） | int-001 |
| sourceTeamId | string | ○ | ソースチームID | team-001 |
| targetTeamId | string | ○ | ターゲットチームID | team-002 |
| mode | string | ○ | インタラクションモード | x-as-a-service |
| description | string | | インタラクションの説明 | Payment team uses Auth API |
| label | string | | ラベル（図上の表示用） | Auth |

**インタラクションモードの値**:
- `collaboration`: Collaboration（密接な協力）
- `x-as-a-service`: X-as-a-Service（サービス提供）
- `facilitating`: Facilitating（支援・ファシリテーション）

#### 6.4.5 repositories.csv
チームが管理するコードリポジトリを管理

| カラム名 | 型 | 必須 | 説明 | 例 |
|---------|-----|------|------|-----|
| id | string | ○ | リポジトリID（一意） | repo-001 |
| teamId | string | ○ | 管理チームID | team-001 |
| name | string | ○ | リポジトリ名 | payment-service |
| url | string | | リポジトリURL | https://github.com/org/payment-service |
| description | string | | 説明 | Payment processing microservice |
| primaryLanguage | string | | 主要言語 | TypeScript |

#### 6.4.6 CSVインポート・エクスポートの仕様

**エクスポート時の動作**:
1. ユーザーが「Export as CSV」を選択
2. 上記5つのCSVファイルを生成
3. ZIP形式でまとめてダウンロード（例: `topology-export-20260105.zip`）
4. ZIPには以下が含まれる：
   - `teams.csv`
   - `services.csv`
   - `dependencies.csv`
   - `interactions.csv`
   - `repositories.csv`
   - `README.txt`（フォーマット説明）

**インポート時の動作**:
1. ユーザーがZIPファイルまたは個別CSVファイルを選択
2. バリデーション実施：
   - 必須カラムの存在確認
   - IDの一意性確認
   - 外部キー参照の整合性確認（teamId, serviceId等が存在するか）
   - データ型の検証
3. エラーがあれば詳細なエラーメッセージを表示
4. 成功すれば現在のトポロジーにマージまたは置換（ユーザーに選択させる）

**CSV文字コード**:
- UTF-8 BOM付き（Excelでの文字化け防止）

**配列データの表現**:
- セミコロン（`;`）区切りで複数値を表現
- 例: `TypeScript;React;Node.js`

---

## 7. 技術スタック

### 7.1 フロントエンド
- **フレームワーク**: Next.js 14+ (App Router)
- **UIライブラリ**: React 18+
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **グラフ描画**: React Flow または ReactFlow (ビジュアルエディタ)
- **状態管理**: Zustand または Jotai (軽量な状態管理)
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod

### 7.2 UI コンポーネント
- **コンポーネントライブラリ**: shadcn/ui (カスタマイズ性の高いコンポーネント)
- **アイコン**: Lucide React

### 7.3 ファイル操作
- **JSON/YAML処理**: js-yaml
- **CSV処理**: papaparse (CSV解析・生成ライブラリ)
- **ZIP処理**: jszip (ZIPファイルの作成・展開)
- **ファイルダウンロード**: file-saver
- **画像生成**: html-to-image または dom-to-image

### 7.4 開発環境
- **パッケージマネージャー**: pnpm または npm
- **リンター**: ESLint
- **フォーマッター**: Prettier
- **型チェック**: TypeScript strict mode

---

## 8. UI/UX要件

### 8.1 レイアウト構成

```
+----------------------------------------------------------+
|  Header (ツールバー)                                       |
|  [New] [Open] [Save] [Export] | [Undo] [Redo] | [?]      |
+----------------------------------------------------------+
|  Sidebar  |              Main Canvas                      |
|  (左)     |                                              |
|  --------  |                                              |
|  チーム    |        [Team Topology Graph]                 |
|  タイプ    |                                              |
|  選択      |                                              |
|           |                                              |
|  --------  |                                              |
|  チーム    |                                              |
|  リスト    |                                              |
|           |                                              |
+----------------------------------------------------------+
|  Properties Panel (右・トグル式)                           |
|  選択されたチーム/インタラクションの詳細編集                 |
+----------------------------------------------------------+
```

### 8.2 カラースキーム
- **Stream-Aligned**: Blue (#3B82F6)
- **Enabling**: Green (#10B981)
- **Complicated-Subsystem**: Purple (#8B5CF6)
- **Platform**: Orange (#F59E0B)
- **Collaboration**: 太い双方向線 (#6B7280)
- **X-as-a-Service**: 単方向矢印 (#3B82F6)
- **Facilitating**: 点線矢印 (#10B981)

### 8.3 操作フロー

#### 新規チーム追加
1. サイドバーからチームタイプを選択
2. キャンバス上の配置場所をクリック
3. プロパティパネルで詳細情報を入力

#### インタラクション追加
1. ツールバーから「接続モード」を選択
2. ソースチームをクリック
3. ターゲットチームをクリック
4. インタラクションタイプを選択

#### ファイル保存
1. ツールバーの「Save」をクリック
2. ファイル名と形式(JSON/YAML/CSV)を選択
3. ブラウザのダウンロード機能で保存

#### CSVエクスポート
1. ツールバーの「Export」→「Export as CSV」を選択
2. 5つのCSVファイルがZIPにパッケージングされる
3. `topology-export-YYYYMMDD.zip` がダウンロードされる
4. ZIPを展開すると以下のファイルが含まれる：
   - teams.csv
   - services.csv
   - dependencies.csv
   - interactions.csv
   - repositories.csv
   - README.txt

#### CSVインポート
1. ツールバーの「Import」→「Import from CSV」を選択
2. ZIPファイルまたは個別のCSVファイルを選択
3. バリデーション結果が表示される
   - エラーがある場合：エラー詳細を表示、修正を促す
   - 成功の場合：インポートモード選択画面へ
4. インポートモードを選択：
   - 「マージ」：既存データに追加
   - 「置換」：既存データを削除して新規作成
5. 確認ダイアログで「OK」をクリック
6. データがインポートされ、キャンバスに反映

---

## 9. 開発フェーズ提案

### Phase 1: MVP (Minimum Viable Product)
**目標**: 基本的な描画・編集機能の実装

- [ ] Next.js プロジェクトセットアップ
- [ ] データモデルの定義 (TypeScript型)
- [ ] React Flow の統合
- [ ] 4つのチームタイプの作成機能
- [ ] 3つのインタラクションモードの作成機能
- [ ] 基本的なプロパティ編集 (チーム名, タイプ, 説明)
- [ ] JSON形式での保存・読込
- [ ] ブラウザ LocalStorage への自動保存

**期待成果**: 基本的なトポロジーの描画と保存が可能

### Phase 2: Team API & データ管理
**目標**: Team API情報の管理と高度なデータ管理

- [ ] Team API フォーム実装
  - コードリポジトリ管理
  - 提供サービス管理
  - 依存関係管理
- [ ] YAML形式対応
- [ ] CSV形式対応
  - CSVエクスポート機能（5つのCSVファイル生成）
  - ZIPファイルでの一括ダウンロード
  - CSVインポート機能（個別またはZIPファイル）
  - データバリデーション（整合性チェック）
  - マージ/置換モード選択
- [ ] ファイルインポート機能 (JSON/YAML/CSV)
- [ ] データバリデーション (Zod)
- [ ] エクスポート設定 (選択項目のカスタマイズ)

**期待成果**: 詳細な組織情報の管理が可能。Excelやスプレッドシートでの一括編集にも対応

### Phase 3: ビジュアル強化 & UX改善
**目標**: 使いやすさと視覚的魅力の向上

- [ ] 自動レイアウト機能
- [ ] ミニマップ
- [ ] 検索・フィルタ機能
- [ ] Undo/Redo 機能
- [ ] ダークモード対応
- [ ] キーボードショートカット
- [ ] ガイド・ツアー機能

**期待成果**: 快適な操作性と美しいUI

### Phase 4: 分析・出力機能
**目標**: 意思決定支援と共有機能

- [ ] 認知負荷の可視化
- [ ] チーム依存関係の分析
- [ ] PNG/SVG画像エクスポート
- [ ] Mermaid/PlantUML出力
- [ ] PDF レポート生成
- [ ] 統計情報ダッシュボード

**期待成果**: 組織設計の分析と共有が容易に

### Phase 5: 高度な機能 (将来拡張)
- [ ] 複数トポロジーの比較機能
- [ ] テンプレートギャラリー
- [ ] チーム進化のタイムライン表示
- [ ] Conway's Lawチェッカー
- [ ] リアルタイムコラボレーション

---

## 10. 制約事項と前提条件

### 10.1 制約事項
- クライアントサイドのみで動作 (バックエンドなし)
- ブラウザ環境が必須
- 大規模組織 (100チーム以上) ではパフォーマンス低下の可能性

### 10.2 前提条件
- ユーザーはTeam Topologiesの基本概念を理解している
- モダンブラウザ (ES2020+ サポート) を使用
- JavaScriptが有効

### 10.3 今後の検討事項
- バックエンド連携によるチーム管理
- 外部ツール連携 (Jira, GitHub, Slack等)
- モバイル対応
- マルチユーザー・リアルタイム編集

---

## 11. 成功指標

### 11.1 技術的指標
- [ ] 全ての機能要件が実装されている
- [ ] テストカバレッジ 80% 以上
- [ ] TypeScript strict mode でエラーゼロ
- [ ] Lighthouse スコア 90以上

### 11.2 ユーザー指標
- [ ] 初回ユーザーが30分以内にトポロジーを作成できる
- [ ] ファイル保存・読込が正常に動作
- [ ] ブラウザリロード後もデータが保持される

---

## 付録A: 参考資料

### Team Topologies 関連
- 書籍: "Team Topologies" by Matthew Skelton and Manuel Pais
- 公式サイト: https://teamtopologies.com/

### 技術リファレンス
- Next.js: https://nextjs.org/
- React Flow: https://reactflow.dev/
- shadcn/ui: https://ui.shadcn.com/

---

**文書管理**
- 初版作成: 2026-01-05
- 最終更新: 2026-01-05 (CSV機能追加)
- 管理者: Team Topologies Designer Project
