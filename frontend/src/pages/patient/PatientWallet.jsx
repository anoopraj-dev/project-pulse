import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { getPatientWallet } from "../../api/patient/patientApis";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";


const categoryIcon = {
  refund: "mdi:arrow-down-circle",
  payment: "mdi:arrow-up-circle",
  topup: "mdi:plus-circle",
};

const PatientWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await getPatientWallet();
      if (!res?.data?.success) {
        toast.error(res?.data?.message || "Failed to load wallet");
        return;
      }
      setWallet(res.data.wallet);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      // fallback to mock
      setWallet(mockWallet);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  if (loading) return <ProfileShimmer />;

  const totalIn = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="my-2 bg-gradient-to-br from-sky-50 via-white to-cyan-100 rounded-xl">
        <div className="px-2 sm:px-4 md:px-6 lg:px-20 xl:px-48 pb-6 pt-20">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Patient · Wallet
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">My Wallet</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Manage your wallet balance and view your transaction history.
            </p>
          </div>
        </div>
      </div>

      <div className=" w-full px-2 pt-3 pb-10 flex flex-col gap-4 lg:flex-row">

        {/* Balance Card */}
        <div className="w-full lg:w-1/3">
          <div
          style={{
            background: "linear-gradient(135deg, #0096C7 0%, #0077B6 60%, #023E8A 100%)",
            borderRadius: "20px",
            padding: "28px 28px 24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,150,199,0.18)",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 180, height: 180, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }} />
          <div style={{
            position: "absolute", bottom: -30, right: 60,
            width: 110, height: 110, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  Available Balance
                </p>
                <p style={{ color: "#fff", fontSize: 38, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1 }}>
                  ₹{(wallet?.balance/100 || 0).toFixed(2) || "0.00"}
                </p>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon icon="mdi:wallet-outline" style={{ width: 24, height: 24, color: "#fff" }} />
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px",
              }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 4 }}>Money In</p>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>+₹{(totalIn/100).toFixed(2)}</p>
              </div>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px",
              }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 4 }}>Money Out</p>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>-₹{(totalOut/100).toFixed(2)}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                background: "#fff", color: "#0077B6", border: "none", borderRadius: 12,
                padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}>
                <Icon icon="mdi:plus" style={{ width: 18, height: 18 }} />
                Add Funds
              </button>
              <button style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 12, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                <Icon icon="mdi:bank-transfer-out" style={{ width: 18, height: 18 }} />
                Withdraw
              </button>
            </div>
          </div>
        </div>
        </div>

       <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         {/* Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div style={{ padding: "18px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Recent Transactions
            </h3>
            <span style={{ fontSize: 12, color: "#0096C7", fontWeight: 500, cursor: "pointer" }}>See all</span>
          </div>

          {transactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#94a3b8" }}>
              <Icon icon="mdi:wallet-outline" style={{ width: 40, height: 40, marginBottom: 10, opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ padding: "8px 0" }}>
              {transactions.map((txn, i) => {
                const isCredit = txn.amount > 0;
                const icon = categoryIcon[txn.category] || (isCredit ? "mdi:arrow-down-circle" : "mdi:arrow-up-circle");
                return (
                  <div key={txn.id} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 20px",
                    borderBottom: i < transactions.length - 1 ? "1px solid #f8fafc" : "none",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: isCredit ? "#f0fdf4" : "#fff5f5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon icon={icon} style={{
                        width: 22, height: 22,
                        color: isCredit ? "#10b981" : "#ef4444",
                      }} />
                    </div>

                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                     
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {txn.type}
                      </p>
                       <p style={{ fontSize: 13, color: "#336bdbff", margin: "2px 0 0" }}>
                        {txn.notes}
                      </p>
                      <p style={{ fontSize: 13, color: "#608ce4ff", margin: "2px 0 0" }}>
                        {new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {/* Amount */}
                    <p style={{
                      fontSize: 14, fontWeight: 700, margin: 0, flexShrink: 0,
                      color: isCredit ? "#10b981" : "#ef4444",
                    }}>
                      {isCredit ? `+₹${(txn.amount/100).toFixed(2)}` : `-₹${Math.abs(txn.amount).toFixed(2)}`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
       </div>
      </div>
    </div>
  );
};

export default PatientWallet;