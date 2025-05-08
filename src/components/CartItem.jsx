import React from 'react';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex items-center border-b py-4">
      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600 text-sm">₩{item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2"
        >－</button>
        <span className="px-3">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="px-2"
        >＋</button>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="ml-4 text-red-500 hover:underline text-sm"
      >삭제</button>
    </div>
  );
}
