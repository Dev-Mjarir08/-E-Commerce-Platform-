import React from "react";
import { IoCartOutline } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { SiHackthebox } from "react-icons/si";
import { RiCustomerService2Line } from "react-icons/ri";
import { LuActivity } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";


import "./Profile.css";

export default function Profile() {
  return (

    <div className="dashboard-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="../src/assets/IMG-20260713-WA0014.jpg"
            alt="Rouhan"
            className="profile-img"
          />
          <div className="profile-info">
            <h3 className="portal-title"> Mohammed Rouhan</h3>
            <p className="user-name">Bengaluru, Karnataka, India</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">
<MdDashboard  className="text-xl" />
            Overview
          </a>
          <a className="flex items-center relative left-4 top-[8px] gap-3 text-sm">
              <IoCartOutline className="text-[3.5vh]" />
           <span> Orders </span>
          </a>
          <a href="#products" className="nav-item text-lg relative top-[14px]">
<SiHackthebox className="text-xl"/>


            Products
          </a>
          <a href="#customers" className="nav-item relative top-[10px]">
<RiCustomerService2Line className="text-xl" />

            Customers
          </a>
          <a href="#marketing" className="nav-item relative top-[7px]">
            <LuActivity className="text-[20px]" />

            Marketing
          </a>
          <a href="#reports" className="nav-item relative top-[3px]">
            <TbReportSearch className="text-[20px]" />

            Reports
          </a>
          <a href="#payouts" className="nav-item">
            <MdOutlinePayments className="text-[20px]" />

            Payouts
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER BAR */}
        <header className="top-header">
          <div className="header-actions">
            <button className="icon-btn relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="dot"></span>
            </button>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </button>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </header>

        {/* METRICS ROW */}
        <section className="metrics-grid">
          <div className="card metric-card">
            <div className="metric-header">
              <span>TOTAL SALES</span>
              <span className="subtext-badge">📈 This Month</span>
            </div>
            <h2>$14,567.89</h2>
            <p className="trend positive">↑ 12.3% <span className="muted">vs last month</span></p>
          </div>

          <div className="card metric-card">
            <span>NEW ORDERS</span>
            <h2>89</h2>
            <p className="trend positive">↑ 5.1%</p>
          </div>

          <div className="card metric-card">
            <span>AVERAGE ORDER VALUE</span>
            <h2>$163.68</h2>
            <p className="trend positive">↑ 3.9%</p>
          </div>

          <div className="card metric-card">
            <span>ACTIVE PRODUCTS</span>
            <h2>156</h2>
            <p className="muted-text">2 pending review</p>
          </div>
        </section>

        {/* MIDDLE GRID: CHART & TOP SELLING */}
        <section className="middle-grid">
          {/* CHART CARD */}
          <div className="card chart-card">
            <h3>SALES TREND - THIS MONTH</h3>
            <div className="chart-placeholder">
              <svg viewBox="0 0 500 150" className="chart-svg">
                <path d="M0,120 L80,90 L160,105 L240,60 L320,110 L400,60 L480,20" fill="none" stroke="#107c6f" strokeWidth="3"/>
                <path d="M0,135 L80,110 L160,120 L240,90 L320,120 L400,85 L480,60" fill="none" stroke="#71c4ac" strokeWidth="2" strokeDasharray="4"/>
                <circle cx="240" cy="60" r="4" fill="#107c6f"/>
                <circle cx="240" cy="90" r="4" fill="#71c4ac"/>
              </svg>
              {/* Tooltip mockup */}
              <div className="chart-tooltip">
                <p className="tooltip-line dark">• $19.59</p>
                <p className="tooltip-line light">• $3.55</p>
              </div>
            </div>
            <div className="chart-labels">
              <span>Day 3</span>
              <span>Day 8</span>
              <span>Day 10</span>
              <span>Day 13</span>
              <span>Day 15</span>
              <span>Day 17</span>
              <span>Day 23</span>
              <span>Day 29</span>
            </div>
          </div>

          {/* TOP SELLING PRODUCTS */}
          <div className="card top-products-card">
            <h3>TOP SELLING PRODUCTS</h3>
            <div className="product-list-header">
              <span>Product Name</span>
            </div>
            <div className="product-list">
              <div className="product-item">
                <span className="p-name">Eco-friendly Bamboo Watch</span>
                <div className="bar-wrapper"><div className="bar fill-100"></div></div>
                <span className="p-units">45 units</span>
              </div>
              <div className="product-item">
                <span className="p-name">Clart Resign Watch</span>
                <div className="bar-wrapper"><div className="bar fill-75"></div></div>
                <span className="p-units">32 units</span>
              </div>
              <div className="product-item">
                <span className="p-name">Eco-friendly Bamboo Watch</span>
                <div className="bar-wrapper"><div className="bar fill-50"></div></div>
                <span className="p-units">22 units</span>
              </div>
              <div className="product-item">
                <span className="p-name">Plant Prilisher Watch</span>
                <div className="bar-wrapper"><div className="bar fill-30"></div></div>
                <span className="p-units">12 units</span>
              </div>
              <div className="product-item">
                <span className="p-name">Eco-friendly Bamboo Watch</span>
                <div className="bar-wrapper"><div className="bar fill-15"></div></div>
                <span className="p-units">8 units</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM GRID: HEALTH & RECENT ORDERS */}
        <section className="bottom-grid">
          {/* STORE HEALTH */}
          <div className="card store-health-card">
            <h3>STORE HEALTH</h3>
            <div className="health-item">
              <span>Fulfillment Rate</span>
              <strong>98.5%</strong>
            </div>
            <div className="health-item">
              <span>Customer Rating</span>
              <strong>4.7 ★★★★☆</strong>
            </div>
            <div className="health-item">
              <span>Inventory Alerts</span>
              <strong>5 items low</strong>
            </div>
          </div>

          {/* RECENT ORDERS TABLE */}
          <div className="card recent-orders-card">
            <h3>RECENT ORDERS</h3>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="link">#8901</td>
                  <td>M. Smith</td>
                  <td><span className="status-badge delivered">Delivered</span></td>
                  <td>$163.68</td>
                  <td>Apr 13, 2023</td>
                </tr>
                <tr>
                  <td className="link">#8902</td>
                  <td>M. Smith</td>
                  <td><span className="status-badge processing">Processing</span></td>
                  <td>$12.00</td>
                  <td>Apr 12, 2024</td>
                </tr>
                <tr>
                  <td className="link">#8903</td>
                  <td>J. Smith</td>
                  <td><span className="status-badge shipped">Shipped</span></td>
                  <td>$12.90</td>
                  <td>Apr 13, 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}