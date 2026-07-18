import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { productService, ProductEntityResponse, ProductSimpleResponse } from "@/services/product.service";
import { formatImageUrl } from "@/utils/image";
import { cartService } from "@/services/cart.service";
import { authService } from "@/services/auth.service";
import { commentService } from "@/services/comment.service";
import { uploadService } from "@/services/upload.service";
import { Star, ShoppingCart, Loader2, Heart, Plus, Minus, ArrowLeft, Upload, Trash2 } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductEntityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "sustainability" | "reviews">("description");
  
  // Comments
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const [commentMediaUrls, setCommentMediaUrls] = useState<string[]>([]);
  const [uploadingCommentMedia, setUploadingCommentMedia] = useState(false);

  const handleCommentMediaUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploadingCommentMedia(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadService.uploadFile(files[i]);
        urls.push(res.data.url);
      }
      setCommentMediaUrls(prev => [...prev, ...urls]);
    } catch (err: any) {
      alert("Failed to upload review image: " + err.message);
    } finally {
      setUploadingCommentMedia(false);
    }
  };

  const handleRemoveCommentMedia = (idxToRemove: number) => {
    setCommentMediaUrls(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Related products
  const [relatedProducts, setRelatedProducts] = useState<ProductSimpleResponse[]>([]);

  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
      fetchComments(id);
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchProductDetail = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductDetail(productId);
      const data = response.data;
      if (data) {
        if (data.mainImage) data.mainImage = formatImageUrl(data.mainImage);
        if (data.subImages) data.subImages = data.subImages.map(formatImageUrl);
      }
      setProduct(data);
      setSelectedImage(data.mainImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600");
    } catch (err: any) {
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (productId: string) => {
    setCommentsLoading(true);
    try {
      const response = await commentService.listComments();
      const filtered = response.data.filter((c: any) => c.productId === Number(productId));
      setComments(filtered);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productService.listProducts(0, 4);
      const content = response.data.content || [];
      const formattedContent = content.map(p => ({
        ...p,
        mainImage: formatImageUrl(p.mainImage)
      }));
      setRelatedProducts(formattedContent.filter((p) => p.id !== Number(id)).slice(0, 4));
    } catch (err) {
      console.error("Failed to load related products", err);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const userId = authService.getUserId();
    if (!userId) {
      navigate("/signin");
      return;
    }
    try {
      await cartService.addToCart(product.id, quantity, userId);
      alert(`Added ${quantity} item(s) to cart successfully!`);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      alert(err.message || "Failed to add to cart");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const userId = authService.getUserId();
    if (!userId) {
      navigate("/signin");
      return;
    }
    if (!newCommentText.trim()) return;

    try {
      await commentService.createOrUpdateComment(null, {
        content: newCommentText,
        rating: newRating,
        mediaUrls: commentMediaUrls,
        userId: userId,
        productId: product.id,
        parentId: null
      });
      setNewCommentText("");
      setNewRating(5);
      setCommentMediaUrls([]);
      fetchComments(String(product.id));
      alert("Review posted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to post review");
    }
  };

  const handlePostReply = async (parentCommentId: number) => {
    if (!product) return;
    const userId = authService.getUserId();
    if (!userId) {
      navigate("/signin");
      return;
    }
    if (!replyText.trim()) return;

    try {
      await commentService.createOrUpdateComment(null, {
        content: replyText,
        rating: 5,
        mediaUrls: [],
        userId: userId,
        productId: product.id,
        parentId: parentCommentId
      });
      setReplyText("");
      setActiveReplyCommentId(null);
      fetchComments(String(product.id));
      alert("Reply posted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to post reply");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#25521f]" size={40} />
        <p className="text-sm text-[#42493e]">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-12 text-center">
        <p className="text-red-600 font-semibold mb-6">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25521f] text-white rounded-sm text-sm hover:bg-[#1a1c19] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>
      </div>
    );
  }

  const conventionalCarbon = product.carbonIndex ? (product.carbonIndex * 6).toFixed(1) : "1.8";
  const carbonIndexVal = product.carbonIndex ? product.carbonIndex.toFixed(1) : "0.3";

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-16 py-6 bg-[#fafaf5]">
      {/* Breadcrumbs */}
      <div className="text-xs uppercase tracking-wider text-[#737b6c] mb-6 flex items-center gap-2">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/")}>Home</span>
        <span>&gt;</span>
        <span className="cursor-pointer hover:underline">
          {product.categories?.[0]?.name || "Personal Care"}
        </span>
        <span>&gt;</span>
        <span className="font-bold text-[#1a1c19]">{product.name}</span>
      </div>

      {/* Main product display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Left Column – Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-white border border-[#c2c9bb] rounded-md overflow-hidden flex items-center justify-center p-8 relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600";
              }}
            />
          </div>
          {/* Thumbnails */}
          {product.subImages && product.subImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => setSelectedImage(product.mainImage || "")}
                className={`aspect-square bg-white border rounded-md p-2 flex items-center justify-center ${
                  selectedImage === product.mainImage ? "border-[#25521f] border-2" : "border-[#c2c9bb]"
                }`}
              >
                <img
                  src={product.mainImage}
                  alt="thumbnail main"
                  className="max-h-full max-w-full object-contain"
                />
              </button>
              {product.subImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`aspect-square bg-white border rounded-md p-2 flex items-center justify-center ${
                    selectedImage === imgUrl ? "border-[#25521f] border-2" : "border-[#c2c9bb]"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`thumbnail ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column – Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-['Nimbus_Sans',sans-serif] font-bold text-[#1a1c19] mb-2 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-[#25521f]">
              {product.price.toLocaleString("vi-VN")} VND
            </span>
            <div className="flex items-center gap-1.5 border-l border-[#c2c9bb] pl-4">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-[#1a1c19]">
                {product.avgRating.toFixed(1)} ({comments.length} reviews)
              </span>
            </div>
          </div>

          <p className="text-[#42493e] text-sm leading-relaxed mb-6 whitespace-pre-wrap">
            {product.description || (
              <>
                {product.ecoFriendliness ? `${product.ecoFriendliness} impact product. ` : ""}
                Designed for the eco-conscious consumer, this choice supports plastic reduction and conscious living. Biodegradable and crafted from sustainable materials.
              </>
            )}
          </p>

          {/* Carbon footprint card */}
          <div className="bg-[#eff2eb] border border-[#c2c9bb] rounded-md p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#42493e]">Carbon Footprint</span>
              <span className="text-sm font-bold text-[#25521f]">{carbonIndexVal}kg CO2 / unit</span>
            </div>
            {/* Progress Bars */}
            <div className="flex flex-col gap-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[#42493e] mb-1">
                  <span>YOUR CHOICE: {carbonIndexVal}kg</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#25521f] rounded-full" style={{ width: `${Math.min(100, (product.carbonIndex || 0.3) * 20)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[#737b6c] mb-1">
                  <span>CONVENTIONAL ALTERNATIVE: {conventionalCarbon}kg</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 rounded-full" style={{ width: `${Math.min(100, (Number(conventionalCarbon)) * 10)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.materials?.map((m) => (
              <span key={m.id} className="bg-[#eae4d3] text-[#5c4e36] text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-sm uppercase">
                {m.name}
              </span>
            )) || (
              <>
                <span className="bg-[#eae4d3] text-[#5c4e36] text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-sm uppercase">
                  100% Biodegradable
                </span>
                <span className="bg-[#eae4d3] text-[#5c4e36] text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-sm uppercase">
                  BPA Free
                </span>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto border-t border-[#c2c9bb] pt-6">
            {/* Quantity */}
            <div className="flex items-center justify-between border border-[#c2c9bb] rounded-md h-12 w-32 shrink-0 bg-white">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
                className="w-10 h-full flex items-center justify-center text-[#42493e] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-[#1a1c19]">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-full flex items-center justify-center text-[#42493e] hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-[#25521f] text-white hover:bg-[#1a1c19] font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart size={16} /> ADD TO CART
            </button>

            <button
              className="h-12 w-12 border border-[#c2c9bb] rounded-md hover:bg-[#eae4d3]/20 flex items-center justify-center text-[#42493e] transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="border-t border-[#c2c9bb] pt-8 mb-12">
        <div className="flex gap-8 border-b border-[#c2c9bb] pb-2 mb-6">
          {(["description", "sustainability", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-semibold tracking-wider uppercase relative transition-colors cursor-pointer ${
                activeTab === tab ? "text-[#25521f]" : "text-[#737b6c] hover:text-[#25521f]"
              }`}
            >
              {activeTab === tab && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#25521f]" />
              )}
              {tab === "description" ? "Description" : tab === "sustainability" ? "Sustainability Info" : `Reviews (${comments.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "description" && (
          <div className="text-sm text-[#42493e] leading-relaxed max-w-2xl whitespace-pre-wrap">
            {product.description || "No description provided for this sustainable choice."}
          </div>
        )}

        {activeTab === "sustainability" && (
          <div className="text-sm text-[#42493e] leading-relaxed flex flex-col gap-6 max-w-2xl">
            {/* Category & Materials */}
            <div>
              <h4 className="font-bold text-[#1a1c19] text-base mb-2">Composition & Taxonomy</h4>
              <p className="mb-2">
                <span className="font-bold">Category:</span> {product.categories?.map(c => c.name).join(", ") || "Eco-Living"}
              </p>
              {product.materials && product.materials.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="font-bold">Materials:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map(m => (
                      <span key={m.id} className="bg-[#eff2eb] border border-[#c2c9bb] text-xs px-2.5 py-1 rounded-sm">
                        {m.name} (Eco Rating: {m.ecoRating.toFixed(1)}/5.0)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Green Certificates */}
            {product.greenCertificates && product.greenCertificates.length > 0 && (
              <div className="border-t border-[#c2c9bb]/40 pt-4">
                <h4 className="font-bold text-[#1a1c19] text-base mb-3">Green Certificates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.greenCertificates.map(cert => (
                    <div key={cert.id} className="flex items-center gap-3 bg-white p-3 border border-[#c2c9bb] rounded-md shadow-xs">
                      <img
                        src={cert.imageUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=100"}
                        alt={cert.name}
                        className="h-10 w-10 object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=100";
                        }}
                      />
                      <div>
                        <span className="font-bold block text-xs text-[#1a1c19]">{cert.name}</span>
                        <span className="text-[10px] text-[#737b6c] block mt-0.5">Issued by {cert.issuer}</span>
                        <span className="text-[10px] text-[#737b6c] block">Date: {cert.issueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eco impact detail */}
            <div className="border border-[#c2c9bb] rounded-md p-4 bg-[#eff2eb]">
              <span className="font-semibold text-xs text-[#25521f] block uppercase tracking-wider mb-2">Green Points Program</span>
              <p className="text-xs">
                This item awards <span className="font-bold">+{product.greenPoints} Green Points</span>. Points are automatically credited upon order checkout.
              </p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {commentsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-[#25521f]" size={24} />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-[#737b6c] italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                (() => {
                  const rootComments = comments.filter((c) => !c.parentId);
                  const getReplies = (parentId: number) => comments.filter((c) => c.parentId === parentId);
                  
                  return rootComments.map((comment) => {
                    const replies = getReplies(comment.id);
                    return (
                      <div key={comment.id} className="border-b border-[#c2c9bb]/40 pb-6 last:border-0">
                        {/* Root Comment */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-[#1a1c19]">
                            {comment.userName || `User #${comment.userId}`}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < comment.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[#42493e]">{comment.content}</p>
                        {comment.mediaUrls && comment.mediaUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {comment.mediaUrls.map((url: string, i: number) => (
                              <a key={i} href={formatImageUrl(url)} target="_blank" rel="noreferrer">
                                <img
                                  src={formatImageUrl(url)}
                                  alt={`attachment ${i}`}
                                  className="w-16 h-16 object-cover border border-[#c2c9bb] rounded bg-white hover:opacity-85 transition-opacity"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                        
                        {/* Reply Action */}
                        <div className="mt-2 flex items-center gap-4">
                          <button
                            onClick={() => setActiveReplyCommentId(comment.id)}
                            className="text-xs text-[#25521f] font-semibold hover:underline cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>

                        {/* Inline Reply Form */}
                        {activeReplyCommentId === comment.id && (
                          <div className="mt-4 flex gap-2 max-w-lg">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 border border-[#c2c9bb] rounded-sm px-3 py-1.5 text-xs bg-[#fafaf5] outline-none focus:border-[#25521f]"
                            />
                            <button
                              onClick={() => handlePostReply(comment.id)}
                              className="px-3 py-1.5 bg-[#25521f] text-white text-xs font-bold rounded-sm uppercase tracking-wider hover:bg-[#1a1c19] cursor-pointer"
                            >
                              Send
                            </button>
                            <button
                              onClick={() => setActiveReplyCommentId(null)}
                              className="px-3 py-1.5 border border-[#c2c9bb] text-[#42493e] text-xs font-bold rounded-sm uppercase tracking-wider hover:bg-gray-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {replies.length > 0 && (
                          <div className="ml-8 border-l border-[#c2c9bb]/60 pl-4 mt-4 flex flex-col gap-4">
                            {replies.map((reply) => (
                              <div key={reply.id} className="text-xs">
                                <span className="font-bold text-[#1a1c19] block mb-1">
                                  {reply.userName || `User #${reply.userId}`}
                                </span>
                                <p className="text-[#42493e]">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* Write Review Form */}
            <div className="bg-white border border-[#c2c9bb] rounded-md p-6 h-fit">
              <h4 className="font-bold text-base text-[#1a1c19] mb-4">Write a Review</h4>
              <form onSubmit={handlePostComment} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#42493e] uppercase tracking-wider mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-[#42493e] hover:scale-110 transition-transform"
                      >
                        <Star
                          size={20}
                          className={star <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#42493e] uppercase tracking-wider mb-1">
                    Review Content
                  </label>
                  <textarea
                    rows={4}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Tell us what you like about this product..."
                    className="w-full border border-[#c2c9bb] rounded-sm p-3 text-sm focus:outline-none focus:border-[#25521f] focus:ring-1 focus:ring-[#25521f] bg-[#fafaf5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#42493e] uppercase tracking-wider mb-1">
                    Add Photos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-[#c2c9bb] rounded-sm cursor-pointer bg-[#fafaf5] hover:bg-gray-100 transition-colors">
                      {uploadingCommentMedia ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#25521f]" />
                      ) : (
                        <Upload className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="ml-2 text-xs font-bold uppercase tracking-wider text-gray-600">Upload Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingCommentMedia}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleCommentMediaUpload(e.target.files);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {commentMediaUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {commentMediaUrls.map((url, idx) => (
                          <div key={idx} className="relative w-12 h-12 border border-[#c2c9bb] rounded bg-white flex items-center justify-center overflow-hidden group">
                            <img
                              src={formatImageUrl(url)}
                              alt={`attachment preview ${idx}`}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCommentMedia(idx)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-[#25521f] text-white hover:bg-[#1a1c19] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Curated selections / Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#c2c9bb] pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#737b6c]">Curated Selections</span>
              <h3 className="text-xl font-bold text-[#1a1c19]">You might also like</h3>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-[#25521f] text-xs font-bold hover:underline"
            >
              VIEW ALL SHOP
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="bg-white border border-[#c2c9bb] rounded-md overflow-hidden hover:shadow-sm transition-shadow cursor-pointer flex flex-col group p-4"
              >
                <div className="aspect-square bg-[#fafaf5] rounded-sm overflow-hidden flex items-center justify-center p-4 mb-4 relative">
                  <img
                    src={p.mainImage || ""}
                    alt={p.name}
                    className="object-contain max-h-full max-w-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>
                <h4 className="text-xs font-bold text-[#737b6c] uppercase mb-1">Eco living</h4>
                <h3 className="text-sm font-bold text-[#1a1c19] line-clamp-1 mb-2 group-hover:text-[#25521f] transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-sm text-[#25521f]">
                    {p.price.toLocaleString("vi-VN")} VND
                  </span>
                  <ShoppingCart size={14} className="text-[#737b6c]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
