import { Users, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

const Customers = () => {
  const customers = [
    { id: 'CUST-01', name: 'Vikram Malhotra', email: 'vikram.m@luxury.in', orders: 8, totalSpend: '₹4,12,000', joined: 'Jan 2026', tier: 'VIP Member' },
    { id: 'CUST-02', name: 'Devanshi Shah', email: 'devanshi@atelier.org', orders: 12, totalSpend: '₹6,80,000', joined: 'Feb 2026', tier: 'Privilege Club' },
    { id: 'CUST-03', name: 'Aarav Singhania', email: 'aarav@singhania.co', orders: 5, totalSpend: '₹2,45,000', joined: 'Mar 2026', tier: 'Standard' },
    { id: 'CUST-04', name: 'Rohan Mehra', email: 'rohan.m@studio.com', orders: 3, totalSpend: '₹1,20,000', joined: 'Jun 2026', tier: 'Standard' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Database</h2>
        <p className="text-xs text-slate-500 mt-1">Manage luxury clientele, concierge tiers, and lifetime order values</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Client Tier</th>
              <th className="py-3 px-4">Total Orders</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {c.name}
                  <div className="text-[11px] font-normal text-slate-400">{c.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {c.tier}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{c.orders} Orders</td>
                <td className="py-3.5 px-4 font-black text-emerald-700">{c.totalSpend}</td>
                <td className="py-3.5 px-4 text-slate-500">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
