const stylesPart1 = `

        .admin-dashboard-root {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          min-height: 100vh;
          background-color: #060814;
          background-image: 
            radial-gradient(circle at 5% 15%, rgba(239, 68, 68, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 85% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
          background-attachment: fixed;
          color: #f8fafc;
          font-family: 'Cairo', sans-serif;
          overflow-x: hidden;
        }

        /* Ambient animated aurora bg spheres */
        .admin-dashboard-root::before, .admin-dashboard-root::after {
          content: '';
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(120px);
          opacity: 0.45;
          mix-blend-mode: screen;
        }

        .admin-dashboard-root::before {
          top: -100px;
          right: -50px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%);
          animation: adminFloat1 25s infinite alternate ease-in-out;
        }

        .admin-dashboard-root::after {
          bottom: -100px;
          left: -50px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%);
          animation: adminFloat2 30s infinite alternate ease-in-out;
        }

        @keyframes adminFloat1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, 50px) scale(1.1); }
        }

        @keyframes adminFloat2 {
          0% { transform: translate(0, 0) scale(1.05); }
          100% { transform: translate(50px, -50px) scale(0.95); }
        }

        /* Sidebar Glass Styling */
        .premium-sidebar {
          background: rgba(10, 12, 26, 0.4);
          backdrop-filter: blur(35px) saturate(180%);
          -webkit-backdrop-filter: blur(35px) saturate(180%);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 30px 24px;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 10;
          overflow-y: auto;
        }

        .premium-sidebar::-webkit-scrollbar {
          width: 5px;
        }
        .premium-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .premium-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .premium-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 25px;
        }

        .premium-logo .logo-circle {
          width: 42px;
          height: 42px;
          font-size: 1.4rem;
          font-weight: 900;
          border-radius: 14px;
          background: linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
          animation: spiderPulse 2s ease-in-out infinite;
        }

        .premium-logo span {
          font-weight: 900;
          font-size: 1.2rem;
          background: linear-gradient(135deg, #ff4444 0%, #ffffff 50%, #ff2222 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: spiderNameGlow 2.5s ease-in-out infinite;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .nav-item-premium {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 14px;
          color: #94a3b8;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
        }

        .nav-item-premium:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.03);
          transform: translateX(-4px);
        }

        .nav-item-premium.active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(244, 63, 94, 0.03) 100%);
          border-color: rgba(239, 68, 68, 0.2);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.1);
          border-right: 3px solid #ef4444;
        }

        .nav-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .nav-item-premium.active .nav-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px #ef4444);
        }

        /* Content Area */
        .premium-content {
          padding: 40px;
          z-index: 1;
          position: relative;
        }

        /* Top Header */
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-title-section h1 {
          font-size: 2.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .header-title-section p {
          color: #94a3b8;
          font-size: 0.92rem;
          margin-top: 6px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Stats Cards */
        .premium-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 35px;
        }

        .premium-stat-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .premium-stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .premium-stat-card::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          background: var(--glow-color, rgba(239, 68, 68, 0.12));
          filter: blur(40px);
          top: -20px;
          left: -20px;
          border-radius: 50%;
        }

        .stat-card-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 1;
        }

        .stat-card-title {
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .stat-card-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: #ffffff;
        }

        .stat-card-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: var(--icon-bg, rgba(255, 255, 255, 0.02));
          border: 1px solid var(--icon-border, rgba(255, 255, 255, 0.05));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          z-index: 1;
          color: var(--icon-color, #ffffff);
          box-shadow: var(--icon-shadow, none);
          transition: transform 0.3s ease;
        }

        .premium-stat-card:hover .stat-card-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        /* Filters and Actions Bar */
        .table-filter-bar {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          gap: 15px;
          flex-wrap: wrap;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .search-input-wrapper {
          position: relative;
          flex-grow: 1;
          max-width: 340px;
        }

        .search-input-premium {
          width: 100%;
          background: rgba(255, 255, 255, 0.02) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 12px !important;
          padding: 10px 16px 10px 42px !important;
          color: white !important;
          font-size: 0.92rem !important;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input-premium:focus {
          border-color: rgba(239, 68, 68, 0.4) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.15) !important;
        }

        .search-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1rem;
        }

        .status-tabs-wrapper {
          display: flex;
          gap: 6px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 5px;
          border-radius: 12px;
        }

        .status-tab-btn {
          background: transparent;
          border: none;
          padding: 6px 16px;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
`;
export default stylesPart1;
