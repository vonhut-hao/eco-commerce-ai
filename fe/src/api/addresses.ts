import client from './client';
import { ApiResponse } from './products';

export interface AddressBE {
  id: number;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  isDefault: boolean;
}

export type AddressResponse = AddressBE;

export interface AddressRequest {
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  isDefault?: boolean;
}

export const addressesApi = {
  getUserAddresses: async (): Promise<AddressBE[]> => {
    const res = await client.get<ApiResponse<AddressBE[]>>('/v1/identity/addresses');
    return res.data.data;
  },

  getAddressDetails: async (id: number): Promise<AddressBE> => {
    const res = await client.get<ApiResponse<AddressBE>>(`/v1/identity/addresses/${id}`);
    return res.data.data;
  },

  createAddress: async (request: AddressRequest): Promise<AddressBE> => {
    const res = await client.post<ApiResponse<AddressBE>>('/v1/identity/addresses', request);
    return res.data.data;
  },

  updateAddress: async (id: number, request: AddressRequest): Promise<AddressBE> => {
    const res = await client.put<ApiResponse<AddressBE>>(`/v1/identity/addresses/${id}`, request);
    return res.data.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await client.delete(`/v1/identity/addresses/${id}`);
  },

  setDefaultAddress: async (id: number): Promise<AddressBE> => {
    const res = await client.patch<ApiResponse<AddressBE>>(`/v1/identity/addresses/${id}/default`);
    return res.data.data;
  }
};
