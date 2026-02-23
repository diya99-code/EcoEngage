"use client";

import { CreditCard, Gift, TrendingUp, Info, CheckCircle2, Loader2, RefreshCcw, Copy, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Dashboard() {
    const [userData, setUserData] = useState<any>({ tokens: 0, activities: [], vouchers: [] });
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUserId(u.userId);
            fetchUserData(u.userId);
        } else {
            router.push("/login");
        }
    }, []);

    const fetchUserData = async (uid: string) => {
        try {
            setLoading(true);
            const res = await api.get(`/api/tokens/balance/${uid}`);
            setUserData(res.data);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async (item: string, cost: number) => {
        if (!userId || userData.tokens < cost) {
            if (!userId) alert("Please login.");
            else alert("Insufficient tokens for this reward.");
            return;
        }

        setRedeeming(item);
        try {
            const res = await api.post("/api/tokens/redeem", {
                userId: userId,
                itemId: item,
                cost: cost
            });
            alert(`Success! Your ${item} voucher code is: ${res.data.voucherCode}`);
            await fetchUserData(userId);
        } catch (err) {
            alert("Redemption failed. Check console for details.");
        } finally {
            setRedeeming(null);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    if (!userId) return null; // Or a loader

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <header className="flex justify-between items-center mb-8 fade-in">
                <h2 className="text-4xl font-bold text-white">Impact Dashboard</h2>
                <button onClick={() => fetchUserData(userId)} className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full">
                    <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in">
                <article className="glass-card p-6 rounded-2xl border-white/5">
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Total Tokens</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-bold text-yellow-500">{loading ? "..." : userData.tokens}</h3>
                        <TrendingUp className="text-green-500" />
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed italic">
                        "Your actions are making a real-world difference."
                    </p>
                </article>

                <article className="glass-card p-6 rounded-2xl border-white/5">
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Impact Score</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-bold text-primary">{(userData.tokens / 200).toFixed(2)}</h3>
                        <span className="text-xs font-bold text-primary tracking-tighter uppercase">Verified</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                        Content Contribution Weight: High
                    </p>
                </article>

                <article className="glass-card p-6 rounded-2xl border-white/5">
                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Total Vouchers</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-bold text-accent">{userData.vouchers?.length || 0}</h3>
                        <CreditCard className="text-accent" />
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed font-italic">
                        Active Redemptions across Partner Brands.
                    </p>
                </article>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="fade-in">
                        <header className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                                Redeem Rewards <Info size={16} className="text-slate-500" />
                            </h3>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5 pb-8 mb-4">
                            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between group hover:border-primary/50 transition-all border-white/5">
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="p-3 rounded-lg bg-green-500/10 text-green-500"><Gift /></div>
                                    <div><p className="font-bold text-slate-100 text-sm">Plant 10 Trees</p><p className="text-[11px] text-slate-400">Eden Reforestation Projects</p></div>
                                </div>
                                <button
                                    onClick={() => handleRedeem("Tree Planting", 100)}
                                    disabled={redeeming === "Tree Planting"}
                                    className="w-full py-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all text-sm font-bold"
                                >
                                    {redeeming === "Tree Planting" ? <Loader2 className="animate-spin mx-auto" size={16} /> : "100 Tokens"}
                                </button>
                            </div>

                            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between group hover:border-accent/50 transition-all border-white/5">
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500"><CreditCard /></div>
                                    <div><p className="font-bold text-slate-100 text-sm">$20 Amazon Voucher</p><p className="text-[11px] text-slate-400">Sustainability Partner Deal</p></div>
                                </div>
                                <button
                                    onClick={() => handleRedeem("Amazon Voucher", 500)}
                                    disabled={redeeming === "Amazon Voucher"}
                                    className="w-full py-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-accent group-hover:text-white transition-all text-sm font-bold"
                                >
                                    {redeeming === "Amazon Voucher" ? <Loader2 className="animate-spin mx-auto" size={16} /> : "500 Tokens"}
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="fade-in">
                        <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                            Recent Activity
                        </h3>
                        <div className="glass-card rounded-2xl overflow-hidden border-white/5">
                            <div className="divide-y divide-white/5">
                                {userData.activities?.slice(0, 8).reverse().map((a: any, i: number) => (
                                    <div key={i} className="p-4 flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{a.reason}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(a.date).toLocaleString()}</span>
                                        </div>
                                        <span className="text-primary font-bold">+{a.amount} TKT</span>
                                    </div>
                                ))}
                                {(!userData.activities || userData.activities.length === 0) && (
                                    <p className="p-8 text-center text-slate-500 italic">No activity yet. Go contribute to earn tokens!</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="space-y-6 fade-in">
                    <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                        My Vouchers
                    </h3>
                    <div className="space-y-4">
                        {userData.vouchers?.slice().reverse().map((v: any, i: number) => (
                            <div key={i} className="glass-card p-4 rounded-xl border-accent/20 bg-accent/5 relative group transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Ticket className="text-accent" size={20} />
                                    <p className="font-bold text-slate-200 text-sm">{v.itemId}</p>
                                </div>
                                <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg mt-2 group-hover:bg-black/60 transition-all">
                                    <code className="text-xs font-mono text-accent">{v.code}</code>
                                    <button onClick={() => copyToClipboard(v.code)} className="text-slate-500 hover:text-white">
                                        {copied === v.code ? <CheckCircle2 size={14} className="text-primary" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-600 mt-2">Redeemed on {new Date(v.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                        {(!userData.vouchers || userData.vouchers.length === 0) && (
                            <div className="glass-card p-8 rounded-xl border-dashed border-white/10 text-center">
                                <p className="text-xs text-slate-500 italic">Redeem tokens to see vouchers here.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
