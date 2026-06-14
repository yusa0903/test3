-- =============================================
-- Supabaseのダッシュボード > SQL Editor で実行する
-- =============================================

-- propertiesテーブルを作成
CREATE TABLE properties (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       TEXT        NOT NULL,
  rent       INTEGER     NOT NULL,
  area       TEXT        NOT NULL,
  rooms      TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSを有効化（有効にしないとポリシーが機能しない）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分が登録した物件のみ参照可能
CREATE POLICY "自分の物件のみ参照可能" ON properties
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: user_idが自分のUIDの物件のみ登録可能
CREATE POLICY "自分の物件のみ登録可能" ON properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件のみ更新可能" ON properties
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件のみ削除可能" ON properties
  FOR DELETE USING (auth.uid() = user_id);
