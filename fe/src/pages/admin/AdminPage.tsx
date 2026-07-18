import { useState, useEffect } from "react";
import { adminService, ProductEntityRequest, CategoryEntityRequest, MaterialEntityRequest, GreenCertificateEntityRequest } from "@/services/admin.service";
import { productService } from "@/services/product.service";
import { commentService } from "@/services/comment.service";
import { uploadService } from "@/services/upload.service";
import { formatImageUrl } from "@/utils/image";
import {
  ShieldCheck, ShoppingBag, Layers, Users, BarChart3,
  Plus, Edit, Trash2, Search, X, Loader2, ArrowUpDown, ClipboardList, Upload
} from "lucide-react";

type Tab = "products" | "categories" | "materials" | "greencerts" | "comments" | "orders";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [greencerts, setGreencerts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection states (for bulk delete)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState<ProductEntityRequest>({
    name: "", price: 0, stock: 0, greenPoints: 0, ecoFriendliness: "ECO", carbonIndex: 0.3,
    mainImage: "", subImages: [], categoryIds: [], materialIds: [], description: ""
  });
  const [categoryForm, setCategoryForm] = useState<CategoryEntityRequest>({ name: "", description: "" });
  const [materialForm, setMaterialForm] = useState<MaterialEntityRequest>({ name: "", type: "ORGANIC", ecoRating: 5.0 });
  const [certForm, setCertForm] = useState<GreenCertificateEntityRequest>({ name: "", issuer: "", issueDate: "", imageUrl: "", productId: 0 });

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingSubs, setUploadingSubs] = useState(false);

  const handleMainImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingMain(true);
    try {
      const res = await uploadService.uploadFile(file);
      setProductForm(prev => ({ ...prev, mainImage: res.data.url }));
    } catch (err: any) {
      alert("Failed to upload main image: " + err.message);
    } finally {
      setUploadingMain(false);
    }
  };

  const handleSubImagesUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploadingSubs(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadService.uploadFile(files[i]);
        urls.push(res.data.url);
      }
      setProductForm(prev => ({
        ...prev,
        subImages: [...(prev.subImages || []), ...urls]
      }));
    } catch (err: any) {
      alert("Failed to upload sub images: " + err.message);
    } finally {
      setUploadingSubs(false);
    }
  };

  const handleRemoveSubImage = (indexToRemove: number) => {
    setProductForm(prev => ({
      ...prev,
      subImages: prev.subImages ? prev.subImages.filter((_, idx) => idx !== indexToRemove) : []
    }));
  };

  useEffect(() => {
    fetchData();
    setSelectedIds([]);
    setCurrentPage(1);
    setSearchQuery("");
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products") {
        // Fetch all products (page=0, size=100) to paginate/filter on frontend
        const res = await productService.listProducts(0, 100);
        setProducts(res.data.content || []);
      } else if (activeTab === "categories") {
        const res = await adminService.listCategories();
        setCategories(res.data || []);
      } else if (activeTab === "materials") {
        const res = await adminService.listMaterials();
        setMaterials(res.data || []);
      } else if (activeTab === "greencerts") {
        const res = await adminService.listGreenCerts();
        setGreencerts(res.data || []);
      } else if (activeTab === "comments") {
        const res = await commentService.listComments();
        setComments(res.data || []);
      } else if (activeTab === "orders") {
        const res = await adminService.listAllOrders();
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch data for tab " + activeTab, err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: toggle row selection
  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Helper: select/deselect all rows
  const handleSelectAll = (filteredItems: any[]) => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  // Helper: bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedIds.length} selected item(s)?`)) return;

    try {
      setLoading(true);
      await Promise.all(
        selectedIds.map((id) => {
          if (activeTab === "products") return adminService.deleteProduct(id);
          if (activeTab === "categories") return adminService.deleteCategory(id);
          if (activeTab === "materials") return adminService.deleteMaterial(id);
          if (activeTab === "greencerts") return adminService.deleteGreenCert(id);
          return commentService.deleteComment(id);
        })
      );
      setSelectedIds([]);
      fetchData();
      alert("Selected items deleted successfully.");
    } catch (err: any) {
      alert("Failed to delete some items: " + err.message);
      fetchData();
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (activeTab === "products") {
        await adminService.createOrUpdateProduct(editingId, productForm);
      } else if (activeTab === "categories") {
        await adminService.createOrUpdateCategory(editingId, categoryForm);
      } else if (activeTab === "materials") {
        await adminService.createOrUpdateMaterial(editingId, materialForm);
      } else if (activeTab === "greencerts") {
        await adminService.createOrUpdateGreenCert(editingId, certForm);
      }
      setModalOpen(false);
      setEditingId(null);
      fetchData();
      alert("Saved successfully!");
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleEdit = async (item: any) => {
    setEditingId(item.id);
    setLoading(true);
    try {
      if (activeTab === "products") {
        const res = await productService.getProductDetail(item.id);
        const detail = res.data;
        setProductForm({
          name: detail.name,
          price: detail.price,
          stock: detail.stock,
          greenPoints: detail.greenPoints,
          ecoFriendliness: detail.ecoFriendliness || "ECO",
          carbonIndex: detail.carbonIndex || 0.3,
          mainImage: detail.mainImage || "",
          subImages: detail.subImages || [],
          categoryIds: detail.categories?.map((c: any) => c.id) || [],
          materialIds: detail.materials?.map((m: any) => m.id) || [],
          description: detail.description || ""
        });
      } else if (activeTab === "categories") {
        setCategoryForm({ name: item.name, description: item.description });
      } else if (activeTab === "materials") {
        setMaterialForm({ name: item.name, type: item.type, ecoRating: item.ecoRating });
      } else if (activeTab === "greencerts") {
        setCertForm({ name: item.name, issuer: item.issuer, issueDate: item.issueDate, imageUrl: item.imageUrl, productId: item.productId });
      }
      setModalOpen(true);
    } catch (err: any) {
      alert("Failed to load details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Single delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      setLoading(true);
      if (activeTab === "products") await adminService.deleteProduct(id);
      else if (activeTab === "categories") await adminService.deleteCategory(id);
      else if (activeTab === "materials") await adminService.deleteMaterial(id);
      else if (activeTab === "greencerts") await adminService.deleteGreenCert(id);
      else if (activeTab === "comments") await commentService.deleteComment(id);
      fetchData();
      alert("Deleted successfully.");
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open create modal
  const handleCreateNew = () => {
    setEditingId(null);
    setProductForm({
      name: "", price: 0, stock: 0, greenPoints: 0, ecoFriendliness: "ECO", carbonIndex: 0.3,
      mainImage: "", subImages: [], categoryIds: [], materialIds: [], description: ""
    });
    setCategoryForm({ name: "", description: "" });
    setMaterialForm({ name: "", type: "ORGANIC", ecoRating: 5.0 });
    setCertForm({ name: "", issuer: "", issueDate: "", imageUrl: "", productId: 0 });
    setModalOpen(true);
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    if (!confirm(`Are you sure you want to mark order #${orderId} as ${status}?`)) return;
    try {
      setLoading(true);
      await adminService.updateOrderStatus(orderId, status);
      fetchData();
      alert(`Order status updated to ${status} successfully.`);
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const getFilteredAndSorted = () => {
    let list: any[] = [];
    if (activeTab === "products") list = [...products];
    else if (activeTab === "categories") list = [...categories];
    else if (activeTab === "materials") list = [...materials];
    else if (activeTab === "greencerts") list = [...greencerts];
    else if (activeTab === "comments") list = [...comments];
    else if (activeTab === "orders") list = [...orders];

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => {
        if (activeTab === "products") return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
        if (activeTab === "categories") return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
        if (activeTab === "materials") return item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
        if (activeTab === "greencerts") return item.name.toLowerCase().includes(q) || item.issuer.toLowerCase().includes(q);
        if (activeTab === "comments") return item.content.toLowerCase().includes(q) || item.userName?.toLowerCase().includes(q);
        if (activeTab === "orders") return String(item.id).includes(q) || item.username?.toLowerCase().includes(q) || item.status.toLowerCase().includes(q);
        return false;
      });
    }

    // Sort sorting
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  };

  const filteredAndSortedList = getFilteredAndSorted();
  const totalPages = Math.ceil(filteredAndSortedList.length / itemsPerPage);
  const currentItems = filteredAndSortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-16 py-8 bg-[#fafaf5] flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="bg-[#eff2eb] border border-[#c2c9bb] rounded-md p-4 mb-4">
          <span className="text-[#25521f] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <ShieldCheck size={14} /> Control Panel
          </span>
          <h2 className="text-xl font-bold text-[#1a1c19]">Console Dashboard</h2>
        </div>

        {(["products", "categories", "materials", "greencerts", "comments", "orders"] as Tab[]).map((tab) => {
          const Icon =
            tab === "products" ? ShoppingBag :
            tab === "categories" ? Layers :
            tab === "materials" ? BarChart3 :
            tab === "greencerts" ? ShieldCheck : 
            tab === "comments" ? Users : ClipboardList;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold tracking-wide uppercase transition-colors cursor-pointer w-full text-left ${
                activeTab === tab
                  ? "bg-[#25521f] text-white"
                  : "bg-white border border-[#c2c9bb] text-[#42493e] hover:bg-[#bcf1ad]/10"
              }`}
            >
              <Icon size={18} /> {tab}
            </button>
          );
        })}
      </aside>

      {/* Content Area */}
      <section className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Controls: Search, Add, Bulk Delete */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center bg-white border border-[#c2c9bb] rounded-md px-3 gap-2 h-10 w-full sm:w-[320px] shadow-sm">
            <Search size={16} className="text-[#9ca3af] shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 text-[13px] text-gray-700 outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && activeTab !== "orders" && (
              <button
                onClick={handleBulkDelete}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={14} /> Bulk Delete ({selectedIds.length})
              </button>
            )}
            {activeTab !== "comments" && activeTab !== "orders" && (
              <button
                onClick={handleCreateNew}
                className="h-10 px-4 bg-[#25521f] hover:bg-[#1a1c19] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#25521f]" size={36} />
            <p className="text-sm text-[#42493e]">Loading dashboard details...</p>
          </div>
        ) : filteredAndSortedList.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#c2c9bb] rounded-md p-8">
            <p className="text-sm text-[#737b6c] italic">No items found matching the current search parameters.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#c2c9bb] rounded-md overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#eff2eb] text-[#42493e] font-bold border-b border-[#c2c9bb]/60">
                <tr>
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === currentItems.length}
                      onChange={() => handleSelectAll(currentItems)}
                      className="accent-[#25521f]"
                    />
                  </th>

                  {activeTab === "products" && (
                    <>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("id")}>
                        ID <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                        Name <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("price")}>
                        Price <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("stock")}>
                        Stock <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3">GP</th>
                    </>
                  )}

                  {activeTab === "categories" && (
                    <>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("id")}>
                        ID <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                        Name <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3">Description</th>
                    </>
                  )}

                  {activeTab === "materials" && (
                    <>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("id")}>
                        ID <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                        Name <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("type")}>
                        Type <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3">Eco Rating</th>
                    </>
                  )}

                  {activeTab === "greencerts" && (
                    <>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("id")}>
                        ID <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                        Name <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3">Issuer</th>
                      <th className="p-3">Product ID</th>
                    </>
                  )}

                  {activeTab === "comments" && (
                    <>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("id")}>
                        ID <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Content</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Parent ID</th>
                    </>
                  )}

                  {activeTab === "orders" && (
                    <>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("id")}>
                        ID <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("username")}>
                        Customer <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("totalAmount")}>
                        Total <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                      <th className="p-3">Payment</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort("status")}>
                        Status <ArrowUpDown size={12} className="inline ml-1" />
                      </th>
                    </>
                  )}

                  <th className="p-3 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="accent-[#25521f]"
                      />
                    </td>

                    {activeTab === "products" && (
                      <>
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3 font-bold text-[#1a1c19] max-w-[200px] truncate">{item.name}</td>
                        <td className="p-3 font-semibold text-[#25521f]">{item.price.toLocaleString("vi-VN")} VND</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${
                            item.stock <= 5 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.stock} {item.stock <= 5 && "(Low)"}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">+{item.greenPoints}</td>
                      </>
                    )}

                    {activeTab === "categories" && (
                      <>
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3 font-bold text-[#1a1c19]">{item.name}</td>
                        <td className="p-3 max-w-[280px] truncate">{item.description}</td>
                      </>
                    )}

                    {activeTab === "materials" && (
                      <>
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3 font-bold text-[#1a1c19]">{item.name}</td>
                        <td className="p-3 uppercase text-xs font-bold tracking-wider text-[#737b6c]">{item.type}</td>
                        <td className="p-3 font-semibold text-blue-700">{item.ecoRating.toFixed(1)}/5.0</td>
                      </>
                    )}

                    {activeTab === "greencerts" && (
                      <>
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3 font-bold text-[#1a1c19]">{item.name}</td>
                        <td className="p-3">{item.issuer}</td>
                        <td className="p-3 font-bold text-[#25521f]">#{item.productId}</td>
                      </>
                    )}

                    {activeTab === "comments" && (
                      <>
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3 font-semibold">{item.userName || `User #${item.userId}`}</td>
                        <td className="p-3 max-w-[240px] truncate">{item.content}</td>
                        <td className="p-3 font-semibold text-amber-500">{item.rating} ★</td>
                        <td className="p-3">{item.parentId ? `#${item.parentId}` : "-"}</td>
                      </>
                    )}

                    {activeTab === "orders" && (
                      <>
                        <td className="p-3 font-semibold">{item.id}</td>
                        <td className="p-3 font-bold text-gray-800">{item.username || `User #${item.userId}`}</td>
                        <td className="p-3 font-semibold text-[#25521f]">{(item.totalAmount || 0).toLocaleString("vi-VN")} VND</td>
                        <td className="p-3 text-xs">{item.paymentMethodName || "Default"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                            item.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="p-3 text-center flex items-center justify-center gap-2">
                      {activeTab === "orders" ? (
                        <>
                          <button
                            onClick={() => handleViewOrderDetails(item)}
                            className="px-2.5 py-1 text-xs font-bold border border-[#c2c9bb] text-[#42493e] hover:bg-[#bcf1ad]/15 rounded-md transition-colors cursor-pointer"
                          >
                            View Items
                          </button>
                          {item.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(item.id, "COMPLETED")}
                                className="px-2.5 py-1 text-xs font-bold bg-[#25521f] text-white hover:bg-[#1a1c19] rounded-md transition-colors cursor-pointer"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(item.id, "CANCELLED")}
                                className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {activeTab !== "comments" && (
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 border border-[#c2c9bb] text-[#42493e] hover:bg-[#bcf1ad]/15 hover:border-[#25521f] rounded-md transition-colors cursor-pointer"
                              aria-label="Edit"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-500 rounded-md transition-colors cursor-pointer"
                            aria-label="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-[#fafaf5]/40 text-xs font-semibold text-[#42493e]">
                <span>Showing page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => c - 1)}
                    className="px-3 py-1.5 border border-[#c2c9bb] rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((c) => c + 1)}
                    className="px-3 py-1.5 border border-[#c2c9bb] rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c2c9bb] rounded-md w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-[#eff2eb] border-b border-[#c2c9bb]/60 p-4 flex items-center justify-between">
              <h3 className="font-bold text-[#1a1c19]">
                {editingId ? "Edit" : "Create"} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#42493e] hover:text-black">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4 text-xs font-semibold text-[#42493e]">
              {activeTab === "categories" && (
                <>
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                </>
              )}

              {activeTab === "materials" && (
                <>
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={materialForm.name}
                      onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Type</label>
                    <select
                      value={materialForm.type}
                      onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    >
                      <option value="ORGANIC">Organic</option>
                      <option value="RECYCLED">Recycled</option>
                      <option value="UPCYCLED">Upcycled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Eco Rating (1.0 - 5.0)</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={materialForm.ecoRating}
                      onChange={(e) => setMaterialForm({ ...materialForm, ecoRating: parseFloat(e.target.value) })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                </>
              )}

              {activeTab === "greencerts" && (
                <>
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={certForm.name}
                      onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Issuer</label>
                    <input
                      required
                      type="text"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Issue Date (YYYY-MM-DD)</label>
                    <input
                      required
                      type="date"
                      value={certForm.issueDate}
                      onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Image URL</label>
                    <input
                      required
                      type="url"
                      value={certForm.imageUrl}
                      onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Product ID</label>
                    <input
                      required
                      type="number"
                      value={certForm.productId}
                      onChange={(e) => setCertForm({ ...certForm, productId: parseInt(e.target.value) })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                </>
              )}

              {activeTab === "products" && (
                <>
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Price (VND)</label>
                      <input
                        required
                        type="number"
                        min="1000"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value) })}
                        className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Stock</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                        className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Green Points</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={productForm.greenPoints}
                        onChange={(e) => setProductForm({ ...productForm, greenPoints: parseInt(e.target.value) })}
                        className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Carbon Index (CO2 kg)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={productForm.carbonIndex}
                        onChange={(e) => setProductForm({ ...productForm, carbonIndex: parseFloat(e.target.value) })}
                        className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Eco Friendliness</label>
                    <input
                      type="text"
                      value={productForm.ecoFriendliness}
                      onChange={(e) => setProductForm({ ...productForm, ecoFriendliness: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Main Image</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste image URL here..."
                          value={productForm.mainImage || ""}
                          onChange={(e) => setProductForm({ ...productForm, mainImage: e.target.value })}
                          className="flex-1 border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                        />
                        <label className="flex items-center justify-center px-4 border border-[#c2c9bb] rounded-sm cursor-pointer bg-[#fafaf5] hover:bg-gray-100 transition-colors">
                          {uploadingMain ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#25521f]" />
                          ) : (
                            <Upload className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-gray-600">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingMain}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleMainImageUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {productForm.mainImage && (
                        <div className="relative w-20 h-20 border border-[#c2c9bb] rounded bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={formatImageUrl(productForm.mainImage)}
                            alt="Main product preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Sub Images</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URLs (comma separated) or click upload..."
                          value={productForm.subImages ? productForm.subImages.join(", ") : ""}
                          onChange={(e) => {
                            const urls = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            setProductForm({ ...productForm, subImages: urls });
                          }}
                          className="flex-1 border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                        />
                        <label className="flex items-center justify-center px-4 border border-[#c2c9bb] rounded-sm cursor-pointer bg-[#fafaf5] hover:bg-gray-100 transition-colors">
                          {uploadingSubs ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#25521f]" />
                          ) : (
                            <Upload className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-gray-600">Upload Multi</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploadingSubs}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleSubImagesUpload(e.target.files);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {productForm.subImages && productForm.subImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {productForm.subImages.map((url, idx) => (
                            <div key={idx} className="relative w-16 h-16 border border-[#c2c9bb] rounded bg-white flex items-center justify-center overflow-hidden group">
                              <img
                                src={formatImageUrl(url)}
                                alt={`Sub preview ${idx}`}
                                className="object-cover w-full h-full"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSubImage(idx)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full border border-[#c2c9bb] rounded-sm p-2 bg-[#fafaf5] outline-none focus:border-[#25521f]"
                    />
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              <div className="border-t border-[#c2c9bb]/60 pt-4 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#c2c9bb] rounded-sm hover:bg-gray-100 cursor-pointer uppercase tracking-wider text-[11px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#25521f] text-white rounded-sm hover:bg-[#1a1c19] cursor-pointer uppercase tracking-wider text-[11px] font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {orderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#c2c9bb] rounded-md w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-[#eff2eb] border-b border-[#c2c9bb]/60 p-4 flex items-center justify-between">
              <h3 className="font-bold text-[#1a1c19]">
                Order Details #{selectedOrder.id}
              </h3>
              <button onClick={() => setOrderDetailsOpen(false)} className="text-[#42493e] hover:text-black">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs font-semibold text-[#42493e]">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-gray-400">Customer</p>
                  <p className="text-sm font-bold text-gray-800">{selectedOrder.username || `User #${selectedOrder.userId}`}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedOrder.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                    selectedOrder.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Total Amount</p>
                  <p className="text-sm font-bold text-[#25521f]">{(selectedOrder.totalAmount || 0).toLocaleString("vi-VN")} VND</p>
                </div>
                <div>
                  <p className="text-gray-400">Payment Method</p>
                  <p className="text-sm font-bold text-gray-800">{selectedOrder.paymentMethodName || "Default"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#1a1c19] mb-2">Purchased Items</h4>
                <div className="border border-[#c2c9bb] rounded-md overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#eff2eb] text-[#42493e] font-bold border-b border-[#c2c9bb]/60">
                      <tr>
                        <th className="p-2">Product</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.orderItems?.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-2 font-bold text-gray-800">{item.productName || `Product #${item.productId}`}</td>
                          <td className="p-2 text-center">{item.quantity}</td>
                          <td className="p-2 text-right">{((item.price || 0) / (item.quantity || 1)).toLocaleString("vi-VN")} VND</td>
                          <td className="p-2 text-right font-semibold text-[#25521f]">{(item.price || 0).toLocaleString("vi-VN")} VND</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#c2c9bb]/60 p-4 bg-[#eff2eb] flex justify-end">
              <button
                onClick={() => setOrderDetailsOpen(false)}
                className="px-4 py-2 bg-[#25521f] text-white rounded-sm hover:bg-[#1a1c19] cursor-pointer uppercase tracking-wider text-[11px] font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
