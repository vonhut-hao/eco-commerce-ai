import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Edit3, Check, Star, X } from "lucide-react";
import { addressesApi, AddressBE, AddressRequest } from "../../api/addresses";
import { toast } from "./Toast";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress?: (address: AddressBE) => void;
  selectedAddressId?: number;
}

export function AddressModal({ isOpen, onClose, onSelectAddress, selectedAddressId }: AddressModalProps) {
  const [addresses, setAddresses] = useState<AddressBE[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressBE | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressesApi.getUserAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi", "Không thể tải danh sách địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditingAddress(null);
    setIsAddingNew(false);
    setRecipientName("");
    setPhoneNumber("");
    setFullAddress("");
    setIsDefault(false);
  };

  const startEdit = (addr: AddressBE) => {
    setEditingAddress(addr);
    setIsAddingNew(false);
    setRecipientName(addr.recipientName);
    setPhoneNumber(addr.phoneNumber);
    setFullAddress(addr.fullAddress);
    setIsDefault(addr.isDefault);
  };

  const startAdd = () => {
    resetForm();
    setIsAddingNew(true);
    if (addresses.length === 0) {
      setIsDefault(true);
    }
  };

  const handleSave = async () => {
    if (!recipientName.trim() || !phoneNumber.trim() || !fullAddress.trim()) {
      toast.error("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: AddressRequest = {
        recipientName: recipientName.trim(),
        phoneNumber: phoneNumber.trim(),
        fullAddress: fullAddress.trim(),
        isDefault
      };

      if (editingAddress) {
        await addressesApi.updateAddress(editingAddress.id, payload);
        toast.success("Thành công", "Đã cập nhật địa chỉ.");
      } else {
        await addressesApi.createAddress(payload);
        toast.success("Thành công", "Đã thêm địa chỉ mới.");
      }
      resetForm();
      await fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await addressesApi.deleteAddress(id);
      toast.success("Thành công", "Đã xóa địa chỉ.");
      await fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi", "Không thể xóa địa chỉ.");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressesApi.setDefaultAddress(id);
      toast.success("Thành công", "Đã đặt làm địa chỉ mặc định.");
      await fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi", "Không thể cập nhật địa chỉ mặc định.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed z-50 bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center pointer-events-none p-0 md:p-4">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:w-[540px] max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e3de] sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#25521f]" />
              <h3 className="text-[#1a1c19] font-['Nimbus_Sans:Bold',sans-serif] text-[18px]">
                {isAddingNew ? "Thêm địa chỉ mới" : editingAddress ? "Chỉnh sửa địa chỉ" : "Địa chỉ của tôi"}
              </h3>
            </div>
            <button onClick={onClose} className="text-[#6b7280] hover:text-[#1a1c19] p-1 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body content */}
          <div className="px-6 py-5 overflow-y-auto flex-1 flex flex-col gap-4">
            {isAddingNew || editingAddress ? (
              /* Add/Edit Form */
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] text-[#6b7280] tracking-wide">Tên người nhận *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1a1c19] outline-none focus:border-[#25521f] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] text-[#6b7280] tracking-wide">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0912345678"
                    className="w-full border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1a1c19] outline-none focus:border-[#25521f] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] text-[#6b7280] tracking-wide">Địa chỉ đầy đủ *</label>
                  <textarea
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    rows={3}
                    className="w-full border border-[#c2c9bb] rounded-xl px-4 py-2.5 text-[14px] text-[#1a1c19] outline-none focus:border-[#25521f] transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="isDefaultCheck"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 accent-[#25521f] rounded cursor-pointer"
                  />
                  <label htmlFor="isDefaultCheck" className="text-[13px] text-[#1a1c19] cursor-pointer select-none">
                    Đặt làm địa chỉ giao hàng mặc định
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={resetForm}
                    disabled={submitting}
                    className="flex-1 border border-[#c2c9bb] text-[#42493e] text-[13px] tracking-widest uppercase py-3 rounded-full hover:bg-[#fafaf5] transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="flex-1 bg-[#25521f] text-white text-[13px] tracking-widest uppercase py-3 rounded-full hover:bg-[#1e4219] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
                  </button>
                </div>
              </div>
            ) : (
              /* Address List */
              <div className="flex flex-col gap-4">
                <button
                  onClick={startAdd}
                  className="w-full border-2 border-dashed border-[#25521f] text-[#25521f] font-medium py-3 rounded-xl hover:bg-[#f0f7ee] transition-colors flex items-center justify-center gap-2 text-[14px]"
                >
                  <Plus size={16} /> Thêm địa chỉ mới
                </button>

                {loading ? (
                  <div className="py-8 text-center text-[#6b7280] text-[14px]">Đang tải danh sách địa chỉ...</div>
                ) : addresses.length === 0 ? (
                  <div className="py-8 text-center text-[#6b7280] text-[14px]">Chưa có địa chỉ giao hàng nào được lưu.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          className={`border rounded-xl p-4 flex flex-col gap-2 relative transition-all ${
                            addr.isDefault ? "border-[#25521f] bg-[#f7faf5]" : "border-[#e2e3de] bg-white hover:border-[#c2c9bb]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-['Nimbus_Sans:Bold',sans-serif] text-[#1a1c19] text-[15px]">
                                {addr.recipientName}
                              </span>
                              <span className="text-[#6b7280] text-[13px]">({addr.phoneNumber})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {addr.isDefault ? (
                                <span className="bg-[#25521f] text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                  <Star size={10} fill="currentColor" /> Mặc định
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetDefault(addr.id)}
                                  className="text-[#6b7280] hover:text-[#25521f] text-[11px] underline"
                                >
                                  Đặt mặc định
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-[#42493e] text-[13px] leading-relaxed">{addr.fullAddress}</p>

                          <div className="flex items-center justify-between border-t border-[#e2e3de] pt-2.5 mt-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEdit(addr)}
                                className="text-[#42493e] hover:text-[#25521f] text-[12px] flex items-center gap-1 transition-colors"
                              >
                                <Edit3 size={13} /> Sửa
                              </button>
                              <span className="text-[#e2e3de]">|</span>
                              <button
                                onClick={() => handleDelete(addr.id)}
                                className="text-[#ba1a1a] hover:text-[#991515] text-[12px] flex items-center gap-1 transition-colors"
                              >
                                <Trash2 size={13} /> Xóa
                              </button>
                            </div>

                            {onSelectAddress && (
                              <button
                                onClick={() => {
                                  onSelectAddress(addr);
                                  onClose();
                                }}
                                className={`text-[12px] px-3 py-1 rounded-full font-medium transition-colors flex items-center gap-1 ${
                                  isSelected
                                    ? "bg-[#25521f] text-white"
                                    : "border border-[#25521f] text-[#25521f] hover:bg-[#25521f] hover:text-white"
                                }`}
                              >
                                {isSelected ? <><Check size={12} /> Đã chọn</> : "Chọn giao đến đây"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
