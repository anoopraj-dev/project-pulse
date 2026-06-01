import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  fetchDoctorWallet,
  walletWithdrawal,
} from "../../api/doctor/doctorApis";
import ProfileShimmer from "../../components/ui/loaders/ProfileShimmer";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import DoctorStatusBanner from "@/components/user/doctor/profile/DoctorStatusBanner";
import { useUser } from "@/contexts/UserContext";
import SearchInput from "@/components/shared/components/SearchInput";
import { useSearch } from "@/hooks/useSearch";
import { fetchSearchSuggestions } from "@/api/user/userApis";
import Pagination from "@/components/shared/components/Pagination";

const categoryIcon = {
  payout: "mdi:arrow-up-circle",
  earning: "mdi:arrow-down-circle",
  refund: "mdi:cash-refund",
};

const DoctorWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifsc: "",
    name: "",
  });

  const { user } = useUser();

  const {
    query,
    setQuery,
    loading: searchLoading,
  } = useSearch({
    type: "transactions",
    role: "doctor",
  });

  // ---------------- FETCH WALLET ----------------
  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetchDoctorWallet(page, 5);

      if (!res?.data?.success) {
        toast.error(res?.data?.message || "Failed to load wallet");
        return;
      }

      setWallet(res.data.wallet);
      setTransactions(res.data?.transactions?.data || []);
      setTotalPages(res.data?.transactions?.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- WITHDRAW HANDLER ----------------
  const handleWithdraw = async () => {
    if (
      !withdrawAmount ||
      isNaN(withdrawAmount) ||
      Number(withdrawAmount) <= 0
    ) {
      return toast.error("Enter valid amount");
    }

    if (!bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.name) {
      return toast.error("Enter bank details");
    }

    const res = await walletWithdrawal({
      amount: withdrawAmount,
      bankDetails,
    });

    toast.success("Withdrawal request submitted");

    setWithdrawAmount("");
    setBankDetails({
      accountNumber: "",
      ifsc: "",
      name: "",
    });
  };

  // ---------------- SEARCH ----------------
  const fetchSuggestions = (query) => {
    return fetchSearchSuggestions({
      role: "doctor",
      query,
      type: "transactions",
    });
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
  };

  useEffect(() => {
    fetchWallet();
  }, [page]);

  if (loading) return <ProfileShimmer />;

  const totalIn = transactions
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

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
      <DoctorStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />

      {user?.status === "blocked" ? (
        <BlockedProfile reason={user?.blockedReason} />
      ) : (
        <>
          <PageBanner config={pageBannerConfig.doctorWallet} />

          <div className="w-full px-4 sm:px-6 lg:px-0 pt-1 pb-6 flex flex-col gap-6 lg:flex-row">
            {/* ---------------- BALANCE CARD ---------------- */}
            <div className="w-full lg:w-1/3">
              <div
                className="relative overflow-hidden rounded-[20px] p-[28px_28px_24px] hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #0096C7 0%, #0077B6 60%, #023E8A 100%)",
                  boxShadow: "0 8px 32px rgba(0,150,199,0.18)",
                }}
              >
                <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-[30px] right-[60px] w-[110px] h-[110px] rounded-full bg-white/[0.05]" />

                <div className="relative z-[1]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/65 text-[11px] tracking-[0.1em] uppercase mb-2 font-bold">
                        Available Balance
                      </p>

                      <p className="text-white text-[38px] font-bold tracking-[-1px] leading-none">
                        ₹{(wallet?.balance / 100 || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-white/[0.15] flex items-center justify-center">
                      <Icon
                        icon="mdi:wallet-outline"
                        className="w-6 h-6 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <div className="flex-1 bg-white/10 rounded-xl px-[14px] py-[10px]">
                      <p className="text-white/60 text-[10px] mb-1 font-bold uppercase tracking-wider">
                        Total Earnings
                      </p>
                      <p className="text-white text-[15px] font-bold">
                        +₹{(totalIn / 100).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex-1 bg-white/10 rounded-xl px-[14px] py-[10px]">
                      <p className="text-white/60 text-[10px] mb-1 font-bold uppercase tracking-wider">Withdrawals</p>
                      <p className="text-white text-[15px] font-bold">
                        -₹{(totalOut / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* ---------------- WITHDRAW SECTION ---------------- */}
                  <div className="flex gap-[10px] mt-5">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-[110px] rounded-xl px-[14px] py-[10px] border border-white/20 text-[14px] text-white font-bold bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />

                    <button
                      onClick={handleWithdraw}
                      className="flex-1 flex items-center justify-center gap-[7px] bg-white text-[#0077B6] rounded-xl py-[11px] text-[13px] font-bold cursor-pointer hover:bg-slate-50 transition active:scale-[0.98]"
                    >
                      <Icon
                        icon="mdi:cash-minus"
                        className="w-[18px] h-[18px]"
                      />
                      Withdraw
                    </button>
                  </div>

                  {/* ---------------- BANK DETAILS ---------------- */}
                  <div className="mt-4 flex flex-col gap-2">
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          accountNumber: e.target.value,
                        })
                      }
                      placeholder="Account Number"
                      className="rounded-xl px-[14px] py-[10px] border border-white/20 text-[14px] text-white bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />

                    <input
                      type="text"
                      value={bankDetails.ifsc}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          ifsc: e.target.value,
                        })
                      }
                      placeholder="IFSC"
                      className="rounded-xl px-[14px] py-[10px] border border-white/20 text-[14px] text-white bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />

                    <input
                      type="text"
                      value={bankDetails.name}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          name: e.target.value,
                        })
                      }
                      placeholder="Account Holder Name"
                      className="rounded-xl px-[14px] py-[10px] border border-white/20 text-[14px] text-white bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- TRANSACTIONS ---------------- */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center px-5 pt-[18px] pb-3 border-b border-slate-100 dark:border-gray-800/80">
                <h3 className="text-sm font-bold text-[#0f172a] dark:text-white m-0">
                  Earnings History
                </h3>
              </div>

              <div className="px-5 py-3 border-b border-slate-50 dark:border-gray-800/40">
                <SearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search earnings"
                  role="doctor"
                  fetchSuggestions={fetchSuggestions}
                  onSelectSuggestion={handleSelectSuggestion}
                  entity="transactions"
                />
              </div>

              <div className="divide-y divide-slate-50 dark:divide-gray-800/50 py-1">
                {filteredTransactions.map((txn, i) => {
                  const isCredit = txn.type === "credit";

                  return (
                    <div
                      key={txn.id || txn._id || i}
                      className="flex items-center gap-[14px] px-5 py-3.5 hover:bg-slate-50/50 dark:hover:bg-gray-800/25 transition-colors duration-200"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isCredit 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500" 
                            : "bg-red-50 dark:bg-red-950/20 text-red-500"
                        }`}
                      >
                        <Icon
                          icon={
                            isCredit
                              ? "mdi:arrow-down-circle"
                              : "mdi:arrow-up-circle"
                          }
                          className="w-[22px] h-[22px]"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 m-0 truncate">
                          {txn.type} - {txn.referenceType || "Earning"}
                        </p>
                        {txn.notes && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-[2px] mb-0 truncate">
                            {txn.notes}
                          </p>
                        )}
                      </div>

                      <p
                        className={`text-[14px] font-bold ${
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
              <div className="p-2 border-t border-slate-50 dark:border-gray-800/80">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorWallet;
