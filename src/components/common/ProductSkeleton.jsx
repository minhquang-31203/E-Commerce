import React from 'react';

// Component hiển thị khung xương tải (skeleton) trong lúc chờ dữ liệu — Dark luxury
const ProductSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="aspect-square skeleton-dark"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 rounded-lg skeleton-dark"></div>
      <div className="h-3 w-1/3 rounded-lg skeleton-dark"></div>
      <div className="h-5 w-1/2 rounded-lg skeleton-dark"></div>
      <div className="h-9 w-full rounded-xl skeleton-dark mt-2"></div>
    </div>
  </div>
);

export default ProductSkeleton;
