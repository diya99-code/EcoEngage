"use client";

import { useEffect, useState } from "react";
import { Leaf, MessageSquare, Heart, Bookmark, Loader2, X, PlusCircle, Share2, Send, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", species: "Tiger" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser).userId);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/blog/posts");
      const formattedPosts = response.data.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
      setPosts(formattedPosts.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !userId) {
      if (!userId) alert("Please login to create a post.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/api/blog/posts", {
        ...newPost,
        authorId: userId
      });
      setShowModal(false);
      setNewPost({ title: "", content: "", species: "Tiger" });
      showToast("Post created! You earned 10 Tokens.");
      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
      ));
      await api.post(`/api/blog/posts/${postId}/like`);
    } catch (error) {
      console.error("Error liking post:", error);
      fetchPosts();
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim() || !userId) {
      if (!userId) alert("Please login to comment.");
      return;
    }

    try {
      await api.post(`/api/blog/posts/${postId}/comment`, {
        text: commentText,
        authorId: userId
      });

      setCommentText("");
      showToast("Comment added! You earned 5 Tokens.");
      await fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShare = (postTitle: string) => {
    const shareUrl = `${window.location.origin}/post/${postTitle.toLowerCase().replace(/ /g, '-')}`;
    navigator.clipboard.writeText(`EcoEngage Spotlight: ${postTitle}\nRead more: ${shareUrl}`);
    showToast("Share link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {toast && (
        <div className="fixed top-20 right-4 z-[200] glass-card px-6 py-3 rounded-full border-primary/50 text-primary font-bold fade-in flex items-center gap-2">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <header className="mb-12 flex justify-between items-end fade-in">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-white">Conservation Feed</h2>
          <p className="text-slate-400">Join the movement. Share knowledge, earn impact tokens.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="glow-btn px-6 py-2 rounded-full font-semibold text-white flex items-center gap-2"
        >
          <PlusCircle size={20} /> Create Post
        </button>
      </header>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-8 rounded-3xl relative fade-in">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-white text-gradient">New Conservation Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text" required value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                placeholder="Title..."
              />
              <select
                value={newPost.species}
                onChange={(e) => setNewPost({ ...newPost, species: e.target.value })}
                className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option>Tiger</option><option>Rhino</option><option>Pangolin</option><option>Elephant</option><option>General</option>
              </select>
              <textarea
                required rows={4} value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                placeholder="Content..."
              />
              <button disabled={isSubmitting} className="w-full glow-btn py-4 rounded-xl font-bold text-white">
                {isSubmitting ? <Loader2 className="animate-spin inline" size={20} /> : "Publish & Earn 10 Tokens"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="glass-card p-6 rounded-2xl border-white/5 hover:border-primary/20 transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{post.species}</span>
                <span className="text-slate-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-100">{post.title}</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">{post.content}</p>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-6">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                    <Heart size={18} className={post.likes > 0 ? "fill-red-400 text-red-400" : ""} /> {post.likes || 0}
                  </button>
                  <button onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)} className={`flex items-center gap-2 transition-colors ${activeCommentId === post.id ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
                    <MessageSquare size={18} /> {post.comments?.length || 0}
                  </button>
                  <button onClick={() => handleShare(post.title)} className="text-slate-400 hover:text-accent transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 font-medium text-sm">
                  <Leaf size={16} /> <span>10 Tokens Reward</span>
                </div>
              </div>

              {activeCommentId === post.id && (
                <div className="mt-6 pt-6 border-t border-white/5 fade-in">
                  <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-b border-white/5 pb-4">
                    {post.comments?.map((c: any, idx: number) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs text-primary font-bold">{c.authorId}</p>
                          <p className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <p className="text-sm text-slate-300">{c.text}</p>
                      </div>
                    ))}
                    {(!post.comments || post.comments.length === 0) && (
                      <p className="text-xs text-slate-500 italic py-4 text-center">No comments yet. Share your thoughts!</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder={userId ? "Add a comment & earn 5 tokens..." : "Please login to comment"}
                      disabled={!userId}
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                    <button onClick={() => handleAddComment(post.id)} disabled={!userId} className="p-2 bg-primary text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50"><Send size={18} /></button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
