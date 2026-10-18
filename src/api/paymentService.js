import apiClient, { apiClientRaw } from './client';

export const paymentService = {
  /**
   * Fetches the user's order history and purchase receipts
   */
  async getMyOrders(page = 0, size = 20) {
    try {
      const res = await apiClient.get('/payments-api/orders', {
        params: { page, size },
      });
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.content)) return res.content;
      if (Array.isArray(res?.data?.content)) return res.data.content;
      return [];
    } catch (e) {
      console.warn('Could not fetch orders:', e?.message);
      return [];
    }
  },

  /**
   * Fetches active passes and series entitlements
   */
  async getMyEntitlements(page = 0, size = 50) {
    try {
      const res = await apiClient.get('/payments-api/entitlements', {
        params: { page, size },
      });
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.content)) return res.content;
      if (Array.isArray(res?.data?.content)) return res.data.content;
      return [];
    } catch (e) {
      console.warn('Could not fetch entitlements:', e?.message);
      return [];
    }
  },
};

export default paymentService;
