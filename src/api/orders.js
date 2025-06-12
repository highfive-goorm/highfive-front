// src/api/orders.js
import api from './index';

/**
 * 새로운 주문 생성
 * @param {object} orderData - OrderCreate 스키마
 * @param {string} orderData.user_id
 * @param {string} orderData.status
 * @param {Array<object>} orderData.order_items
 * @param {boolean} orderData.is_from_cart
 * @param {number} orderData.total_price
 * @returns {Promise<object>} 생성된 주문 정보 (OrderInDB 스키마)
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/order', orderData); // 엔드포인트 변경
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 특정 사용자의 주문 목록 조회
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array<object>>} 주문 목록 (List[OrderInDB])
 */
export const fetchOrders = async (userId) => {
  try {
    const response = await api.get(`/order/user/${userId}`); // 엔드포인트 변경
    return response.data;
  } catch (error) {
    console.error('Error fetching orders by user ID:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 특정 주문 수정 (예: 상태 변경)
 * @param {string} orderId - 주문 ID (_id의 문자열 값)
 * @param {object} updateData - OrderUpdate 스키마 (예: { status: "shipped" })
 * @returns {Promise<object>} 수정된 주문 정보
 */
export const updateOrderStatus = async (orderId, updateData) => {
  try {
    const response = await api.put(`/order/${orderId}`, updateData); // 엔드포인트 변경
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error.response?.data || error.message);
    throw error;
  }
};