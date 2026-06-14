import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'

// 物件の新規登録・編集フォーム（モーダル表示）
// property が null のとき新規登録、値があるとき編集
function PropertyForm({ property, onSuccess, onCancel }) {
  const isEditing = !!property
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: property?.name ?? '',
    rent: property?.rent ?? '',
    area: property?.area ?? '',
    rooms: property?.rooms ?? '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name: form.name,
      rent: parseInt(form.rent, 10),
      area: form.area,
      rooms: form.rooms,
    }

    let error
    if (isEditing) {
      // UPDATE: 対象IDの物件を更新（RLSにより自分の物件のみ更新可能）
      ;({ error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', property.id))
    } else {
      // INSERT: user_idを付与して新規登録
      ;({ error } = await supabase
        .from('properties')
        .insert({ ...payload, user_id: user.id }))
    }

    if (error) {
      setError(isEditing ? '更新に失敗しました: ' + error.message : '登録に失敗しました: ' + error.message)
    } else {
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      {/* クリックがカード内で止まるよう伝播を防ぐ */}
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{isEditing ? '物件を編集' : '物件を新規登録'}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>物件名</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="グランドメゾン渋谷"
            />
          </div>
          <div className="form-group">
            <label>家賃（円）</label>
            <input
              type="number"
              name="rent"
              value={form.rent}
              onChange={handleChange}
              required
              min="0"
              placeholder="120000"
            />
          </div>
          <div className="form-group">
            <label>エリア</label>
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              required
              placeholder="渋谷区"
            />
          </div>
          <div className="form-group">
            <label>間取り</label>
            <input
              type="text"
              name="rooms"
              value={form.rooms}
              onChange={handleChange}
              required
              placeholder="1LDK"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="submit-btn modal-submit-btn">
              {loading ? '保存中...' : isEditing ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm
