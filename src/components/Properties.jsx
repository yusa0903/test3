import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import PropertyForm from './PropertyForm'

function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // showForm: フォームの表示/非表示
  const [showForm, setShowForm] = useState(false)
  // editingProperty: null=新規登録、物件オブジェクト=編集
  const [editingProperty, setEditingProperty] = useState(null)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  }, [])

  // Supabaseから自分の物件一覧を取得（RLSにより自分の物件のみ返される）
  async function fetchProperties() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 削除: 対象IDの物件をSupabaseから削除
  async function handleDelete(id) {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      alert('削除に失敗しました: ' + error.message)
    } else {
      // ローカルのstateからも除外してAPIコールを省く
      setProperties(prev => prev.filter(p => p.id !== id))
    }
  }

  function handleAdd() {
    setEditingProperty(null)
    setShowForm(true)
  }

  function handleEdit(property) {
    setEditingProperty(property)
    setShowForm(true)
  }

  // フォームの登録・更新完了後: モーダルを閉じて一覧を再取得
  function handleFormSuccess() {
    setShowForm(false)
    setEditingProperty(null)
    fetchProperties()
  }

  function handleFormCancel() {
    setShowForm(false)
    setEditingProperty(null)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <div className="header-left">
          <span className="header-logo">🏢</span>
          <h1>不動産管理システム</h1>
        </div>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleSignOut} className="logout-btn">ログアウト</button>
        </div>
      </header>

      <main className="properties-main">
        <div className="properties-title-row">
          <div>
            <h2>物件一覧</h2>
            {!loading && (
              <span className="property-count">全 {properties.length} 件</span>
            )}
          </div>
          <button onClick={handleAdd} className="add-btn">＋ 新規登録</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="state-text">読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className="state-text">登録された物件はありません。「新規登録」から追加してください。</p>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-card-header">
                  <h3 className="property-name">{property.name}</h3>
                </div>

                <div className="property-rent">
                  ¥{property.rent.toLocaleString()}
                  <span className="rent-unit">/月</span>
                </div>

                <div className="property-details">
                  <div className="property-detail">
                    <span className="detail-label">エリア</span>
                    <span className="detail-value">{property.area}</span>
                  </div>
                  <div className="property-detail">
                    <span className="detail-label">間取り</span>
                    <span className="detail-value">{property.rooms}</span>
                  </div>
                </div>

                {/* 編集・削除ボタン */}
                <div className="card-actions">
                  <button onClick={() => handleEdit(property)} className="edit-btn">編集</button>
                  <button onClick={() => handleDelete(property.id)} className="delete-btn">削除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録・編集モーダル */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}

export default Properties
