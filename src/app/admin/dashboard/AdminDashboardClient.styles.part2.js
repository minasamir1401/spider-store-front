const stylesPart2 = `

        .status-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.02);
        }

        .status-tab-btn.active {
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        /* Glass Table Design */
        .premium-table-wrapper {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.3);
          margin-bottom: 25px;
        }

        .premium-table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
          text-align: right;
        }

        .premium-table th {
          background: rgba(255, 255, 255, 0.02);
          padding: 16px 20px;
          color: #94a3b8;
          font-weight: 700;
          font-size: 0.88rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          white-space: nowrap;
        }

        .premium-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          font-size: 0.9rem;
          color: #cbd5e1;
          white-space: nowrap;
        }

        .premium-table tr:hover td {
          background: rgba(255, 255, 255, 0.015);
          color: #ffffff;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          gap: 6px;
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .premium-badge-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.18);
        }
        .premium-badge-pending .badge-dot { background: #fbbf24; }

        .premium-badge-processing {
          background: #fbbf24;
          color: #000000 !important;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .premium-badge-processing .badge-dot { background: #000000; }

        .premium-badge-approved {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.18);
        }
        .premium-badge-approved .badge-dot { background: #34d399; }

        .premium-badge-completed {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.18);
        }
        .premium-badge-completed .badge-dot { background: #34d399; }

        .premium-badge-rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.18);
        }
        .premium-badge-rejected .badge-dot { background: #f87171; }

        .premium-badge-cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.18);
        }
        .premium-badge-cancelled .badge-dot { background: #f87171; }

        /* Custom Action Buttons */
        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-success-premium {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.22);
        }
        .btn-success-premium:hover {
          background: #10b981;
          color: white;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
        }

        .btn-danger-premium {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.22);
        }
        .btn-danger-premium:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
        }

        .btn-edit-premium {
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .btn-edit-premium:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .btn-add-premium {
          background: linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .btn-add-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        }

        /* Categories Grid Layout */
        .category-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 20px;
        }

        .category-card-premium {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 18px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .category-card-premium:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          background: rgba(255, 255, 255, 0.02);
        }

        .category-icon-big {
          font-size: 2.8rem;
          margin-bottom: 12px;
          display: inline-block;
          filter: drop-shadow(0 4px 10px rgba(239, 68, 68, 0.2));
        }

        .category-title-premium {
          font-size: 1.05rem;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
        }

        .category-slug {
          font-size: 0.72rem;
          color: #64748b;
          display: block;
          margin-bottom: 14px;
        }

        .pkg-tag {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 0.65rem;
          color: #94a3b8;
        }

        /* Modal Redone */
        .premium-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 5, 12, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .premium-modal {
          background: #0b0c16;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.08);
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          padding: 26px;
          position: relative;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-height: 85vh;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .premium-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .premium-modal-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
        }

        .close-btn-premium {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn-premium:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        /* Form styling inside modals */
        .premium-modal label {
          font-weight: 700;
          font-size: 0.88rem;
          color: #cbd5e1;
          margin-bottom: 6px;
          display: block;
        }

        .premium-modal select, .premium-modal textarea, .premium-modal input, .premium-modal input[type="file"], .premium-modal input[type="color"] {
          width: 100%;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          color: white !important;
          font-size: 0.9rem !important;
          outline: none;
          transition: all 0.2s ease;
        }

        .premium-modal select:focus, .premium-modal textarea:focus, .premium-modal input:focus {
          border-color: rgba(239, 68, 68, 0.4) !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }

        /* Package line items */
        .pkg-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }

        .pkg-row input {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          color: white !important;
          font-size: 0.85rem !important;
        }

        .pkg-row input:focus {
          border-color: rgba(239, 68, 68, 0.4) !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }

        /* Drawer Overlay */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 5, 12, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 40;
          animation: fadeIn 0.3s ease;
        }
`;
export default stylesPart2;
