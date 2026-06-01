import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  createWalletOrder,
  getPatientWallet,
} from "../../api/patient/patientApis";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";
import { handleRazorpayPayment } from "@/utilis/handleRazorpayPayment";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";
import { useUser } from "@/contexts/UserContext";
import SearchInput from "@/components/shared/components/SearchInput";
import { useSearch } from "@/hooks/useSearch";
import { fetchSearchSuggestions } from "@/api/user/userApis";

const categoryIcon = {
  refund: "mdi:arrow-down-circle",
  payment: "mdi:arrow-up-circle",
  topup: "mdi:plus-circle",
};

const PatientWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const { user } = useUser();
  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
  } = useSearch({
    type: "transactions",
    role: "patient",
  });

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SEARCH SUGGESTIONS ----------------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "patient",
      query,
      type: "transactions",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  const handleAddFunds = async (amount) => {
    try {
      const orderRes = await createWalletOrder({
        amount: amount * 100,
        notes: "Wallet top-up",
      });

      const order = orderRes?.data?.order;
      handleRazorpayPayment({
        order: order,
        role: "patient",
        user: user,
        type: "wallet",
        onSuccess: async () => {
          fetchWallet();
          setAddAmount("");
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create wallet order");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (loading) return <ProfileShimmer />;

  const totalIn = transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  // ---------------- FILTERED TRANSACTIONS ----------------
  const filteredTransactions = transactions.filter((txn) => {
    const searchText = query.toLowerCase();
    return (
      txn.type.toLowerCase().includes(searchText) ||
      (txn.referenceType &&
        txn.referenceType.toLowerCase().includes(searchText)) ||
      (txn.notes && txn.notes.toLowerCase().includes(searchText))
    );
  });

  return (
    <div className="min-h-screen">
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" ? (
        <>
          <BlockedProfile reason={user?.blockedReason} />
        </>
      ) : (
        <>
          {/* Banner */}
          <PageBanner config={pageBannerConfig.patientWallet} />

          <div className="w-full px-4 sm:px-6 lg:px-0 pt-1 pb-10 flex flex-col gap-4 lg:flex-row">
            {/* Balance Card */}
            <div className="w-full lg:w-1/3">
              <div
                className="relative overflow-hidden rounded-[20px] p-[28px_28px_24px]"
                style={{
                  background:
                    "linear-gradient(135deg, #0096C7 0%, #0077B6 60%, #023E8A 100%)",
                  boxShadow: "0 8px 32px rgba(0,150,199,0.18)",
                }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-[30px] right-[60px] w-[110px] h-[110px] rounded-full bg-white/[0.05]" />

                <div className="relative z-[1]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/65 text-[12px] tracking-[0.1em] uppercase mb-2">
                        Available Balance
                      </p>
                      <p className="text-white text-[38px] font-bold tracking-[-1px] leading-none">
                        ₹{(wallet?.balance / 100 || 0).toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-white/[0.15] flex items-center justify-center">
                      <Icon
                        icon="mdi:wallet-outline"
                        className="w-6 h-6 text-white"
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-3 mt-6">
                    <div className="flex-1 bg-white/10 rounded-xl px-[14px] py-[10px]">
                      <p className="text-white/60 text-[11px] mb-1">Money In</p>
                      <p className="text-white text-[15px] font-semibold">
                        +₹{(totalIn / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl px-[14px] py-[10px]">
                      <p className="text-white/60 text-[11px] mb-1">
                        Money Out
                      </p>
                      <p className="text-white text-[15px] font-semibold">
                        -₹{(totalOut / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-[10px] mt-4">
                    {/* Amount input */}
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-[110px] rounded-xl px-[14px] py-[10px] border border-white/20 text-[14px] text-white font-bold bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                    <button
                      onClick={() => {
                        if (
                          !addAmount ||
                          isNaN(addAmount) ||
                          Number(addAmount) <= 0
                        ) {
                          return toast.error("Please enter a valid amount");
                        }
                        handleAddFunds(Number(addAmount));
                      }}
                      className="flex-1 flex items-center justify-center gap-[7px] bg-white text-[#0077B6] border-none rounded-xl py-[11px] text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition active:scale-[0.98]"
                    >
                      <Icon icon="mdi:plus" className="w-[18px] h-[18px]" />
                      Add Funds
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center px-5 pt-[18px] pb-3 border-b border-slate-100 dark:border-gray-800/80">
                <h3 className="text-sm font-bold text-[#0f172a] dark:text-white m-0">
                  Recent Transactions
                </h3>
              </div>
              <div className="px-5 py-3 border-b border-slate-50 dark:border-gray-800/40">
                {/* ------------- Search ------------ */}
                <SearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search transactions"
                  role="patient"
                  fetchSuggestions={fetchSuggestions}
                  onSelectSuggestion={handleSelectSuggestion}
                  entity="transactions"
                />
                {searchLoading && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <Icon icon="mdi:loading" className="animate-spin" />
                    Searching…
                  </div>
                )}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 px-5 text-slate-400">
                  <Icon
                    icon="mdi:wallet-outline"
                    className="w-10 h-10 mb-[10px] opacity-40 mx-auto"
                  />
                  <p className="text-[14px]">No transactions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-gray-800/50 py-1">
                  {filteredTransactions.map((txn, i) => {
                    const isCredit = txn.type === "credit";
                    const icon =
                      categoryIcon[txn.category] ||
                      (isCredit
                        ? "mdi:arrow-down-circle"
                        : "mdi:arrow-up-circle");
                    return (
                      <div
                        key={txn.id || txn._id || i}
                        className="flex items-center gap-[14px] px-5 py-3.5 hover:bg-slate-50/50 dark:hover:bg-gray-800/25 transition-colors duration-200"
                      >
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                            isCredit 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500" 
                              : "bg-red-50 dark:bg-red-950/20 text-red-500"
                          }`}
                        >
                          <Icon
                            icon={icon}
                            className="w-[22px] h-[22px]"
                          />
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 m-0 truncate">
                            {txn.type} - {txn.referenceType}
                          </p>
                          {txn.notes && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-[2px] mb-0 truncate">
                              {txn.notes}
                            </p>
                          )}
                          <p className="text-[11px] text-[#608ce4] mt-[4px] mb-0">
                            {new Date(txn.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* Amount */}
                        <p
                          className={`text-[14px] font-bold m-0 flex-shrink-0 ${
                            isCredit ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {isCredit
                            ? `+₹${(txn.amount / 100).toFixed(2)}`
                            : `-₹${Math.abs(txn.amount / 100).toFixed(2)}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientWallet;
