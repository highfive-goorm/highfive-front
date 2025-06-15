// src/components/CartItem.jsx
import React from 'react';

/**
 * @param {Object} item
 * @param {string|number} item.product_id
 * @param {string} item.name
 * @param {string} item.img_url
 * @param {number} item.price            // 원가
 * @param {number} item.discounted_price // 할인 적용된 금액
 * @param {number} item.discount         // 할인율 (%)
 * @param {number} item.quantity
 * @param {function} onQuantityChange(product_id, newQuantity)
 * @param {function} onRemove(product_id)
 */
export default function CartItem({ item, onQuantityChange, onRemove }) {
  const totalPrice = item.discounted_price * item.quantity;
  const totalOriginal = item.price * item.quantity;

  return (
    <div className="flex items-center border-b py-4">
      <img
        src={item.img_url}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <div className="text-sm">
          {item.price > item.discounted_price ? (
            <>
              <div className="text-gray-400 line-through">
                {totalOriginal.toLocaleString()}원
              </div>
              <div className="text-black font-semibold">
                <span className="text-red-500 mr-1">{item.discount}%</span>
                {totalPrice.toLocaleString()}원
              </div>
            </>
          ) : (
            <div className="text-black font-semibold">
              {totalPrice.toLocaleString()}원
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => onQuantityChange(item.product_id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2"
        >
          －
        </button>
        <span className="px-3">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.product_id, item.quantity + 1)}
          className="px-2"
        >
          ＋
        </button>
      </div>

      <button
        onClick={() => onRemove(item.product_id)}
        className="ml-4 text-red-500 hover:underline text-sm"
      >
        삭제
      </button>
    </div>
  );
}
