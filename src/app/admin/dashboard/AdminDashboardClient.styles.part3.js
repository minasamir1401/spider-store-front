const stylesPart3 = `

        /* Burger Button */
        .admin-burger-btn {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          color: #fff;
          font-size: 1.2rem;
          align-items: center;
          justify-content: center;
          margin-inline-end: 12px;
          transition: all 0.2s ease;
        }
        .admin-burger-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        /* Mobile Drawer Container */
        .mobile-drawer {
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          width: 280px;
          background: rgba(10, 12, 26, 0.85);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          z-index: 45;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        .mobile-drawer.closed {
          transform: translateX(100%);
        }

        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-drawer-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: #ffffff;
        }

        .mobile-drawer-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .mobile-drawer-user-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-drawer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .mobile-drawer-link {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 10px;
          color: #cbd5e1;
          font-weight: 700;
          background: transparent;
          border: none;
          width: 100%;
          text-align: right;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-drawer-link:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }

        .mobile-drawer-link.active {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(244, 63, 94, 0.03) 100%);
          color: white;
          border-right: 3px solid #ef4444;
        }

        .mobile-drawer-link.danger {
          color: #f87171;
          margin-top: auto;
        }

        .user-menu-widget {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-username {
          font-weight: 700;
          font-size: 0.88rem;
          color: #e2e8f0;
        }

        .logout-btn-text {
          font-size: 0.8rem;
          color: #ef4444;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .logout-btn-text:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        /* Desktop Top Header Logout adjustment */
        .header-actions .user-menu-widget {
          display: flex;
        }

        /* Responsiveness */
        @media (max-width: 992px) {
          .admin-dashboard-root {
            grid-template-columns: minmax(0, 1fr);
          }
          .premium-sidebar {
            display: none !important;
          }

          .admin-burger-btn {
            display: flex;
          }

          .header-actions .user-menu-widget {
            display: none !important;
          }

          .premium-content {
            padding: 24px 20px;
            max-height: none;
          }

          .content-header {
            margin-bottom: 25px;
          }

          .premium-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .content-header {
            gap: 12px;
            margin-bottom: 25px;
          }

          .header-actions {
            width: 100%;
            display: flex;
          }

          .header-actions .btn-add-premium {
            flex-grow: 1;
            text-align: center;
            justify-content: center;
          }

          .status-tabs-wrapper {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
            display: flex;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .status-tabs-wrapper::-webkit-scrollbar {
            display: none;
          }

          .status-tab-btn {
            flex-shrink: 0;
          }

          .premium-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .premium-stat-card {
            padding: 16px;
          }

          .stat-card-value {
            font-size: 1.4rem;
          }

          .stat-card-icon-wrapper {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }

          .premium-content {
            padding: 16px 12px;
          }

          .header-title-section h1 {
            font-size: 1.6rem;
          }

          .header-title-section p {
            font-size: 0.85rem;
          }

          .btn-add-premium {
            padding: 8px 14px;
            font-size: 0.82rem;
          }

          .table-filter-bar {
            padding: 12px;
            gap: 10px;
          }

          .category-grid-premium {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .category-card-premium {
            padding: 14px;
          }
        }

        @media (max-width: 768px) {
          .premium-table-wrapper {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            overflow-x: visible !important;
          }
          .premium-table, 
          .premium-table thead, 
          .premium-table tbody, 
          .premium-table th, 
          .premium-table td, 
          .premium-table tr {
            display: block !important;
            width: 100% !important;
          }
          .premium-table thead {
            display: none !important;
          }
          .premium-table tr {
            background: rgba(255, 255, 255, 0.02) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-radius: 16px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
            transition: all 0.3s ease !important;
          }
          .premium-table tr:hover {
            border-color: rgba(239, 68, 68, 0.2) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            transform: translateY(-2px);
          }
          .premium-table td {
            border: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03) !important;
            padding: 10px 0 !important;
            font-size: 0.88rem !important;
            color: #cbd5e1 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            text-align: left !important;
            white-space: normal !important;
          }
          .premium-table td:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
          .premium-table td::before {
            content: attr(data-label) !important;
            font-weight: 800 !important;
            color: #94a3b8 !important;
            margin-left: 16px !important;
            text-align: right !important;
            font-size: 0.82rem !important;
            flex-shrink: 0 !important;
          }
        }

        @media (max-width: 420px) {
          .premium-stats-grid {
            grid-template-columns: 1fr;
          }

          .premium-modal {
            padding: 18px;
          }

          .premium-modal-title {
            font-size: 1.05rem;
          }
        }

`;
export default stylesPart3;
