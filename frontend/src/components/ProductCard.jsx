import React from 'react';
import { Plus, ShoppingCart, Tag } from 'lucide-react';

const ProductCard = ({ title, category, price, image }) => {
    const handleAddToCart = (e) => {
        e.preventDefault();
        console.log(`Added ${title} to cart`);
    };

    return (
        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square w-full overflow-hidden bg-muted relative">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-muted-foreground/50">
                        <ShoppingBag className="h-12 w-12" />
                    </div>
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleAddToCart}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        aria-label="Add to cart"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Tag className="h-3 w-3" />
                    <span>{category}</span>
                </div>
                <h3 className="font-semibold tracking-tight text-lg mb-1 line-clamp-1" title={title}>
                    {title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-primary">
                        ${price.toFixed(2)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
