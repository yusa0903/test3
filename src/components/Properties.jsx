import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 表示用のダミー物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドメゾン渋谷', rent: 150000, area: '渋谷区', rooms: '2LDK', floor: 5, status: '空室' },
  { id: 2, name: 'パークハイツ新宿', rent: 120000, area: '新宿区', rooms: '1LDK', floor: 3, status: '入居中' },
  { id: 3, name: 'サンシャインマンション池袋', rent: 95000, area: '豊島区', rooms: '1K', floor: 2, status: '空室' },
  { id: 4, name: 'ライオンズ品川', rent: 180000, area: '品川区', rooms: '3LDK', floor: 8, status: '入居中' },
  { id: 5, name: 'コスモポリス銀座', rent: 250000, area: '中央区', rooms: '2LDK', floor: 12, status: '入居中' },
  { id: 6, name: 'エクセル恵比寿', rent: 130000, area: '渋谷区', rooms: '1LDK', floor: 4, status: '空室' },
]

function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
          <h2>物件一覧</h2>
          <span className="property-count">全 {DUMMY_PROPERTIES.length} 件</span>
        </div>

        <div className="property-grid">
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-card-header">
                <h3 className="property-name">{property.name}</h3>
                <span className={`property-status ${property.status === '空室' ? 'vacant' : 'occupied'}`}>
                  {property.status}
                </span>
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
                <div className="property-detail">
                  <span className="detail-label">階数</span>
                  <span className="detail-value">{property.floor}F</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Properties
