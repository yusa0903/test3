import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      return setError('パスワードが一致しません')
    }
    if (password.length < 6) {
      return setError('パスワードは6文字以上で入力してください')
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      setError('登録に失敗しました: ' + error.message)
    } else {
      // Supabaseはデフォルトで確認メールを送信する
      setMessage('確認メールを送信しました。メールを確認してからログインしてください。')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🏢</div>
        <h1 className="auth-title">不動産管理システム</h1>
        <h2 className="auth-subtitle">新規登録</h2>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          <div className="form-group">
            <label>パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワードを入力"
            />
          </div>
          <div className="form-group">
            <label>パスワード（確認）</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="パスワードを再入力"
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>

        <p className="auth-link">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
