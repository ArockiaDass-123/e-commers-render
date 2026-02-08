import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
    return (
        <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight font-display">Featured Collection</h2>
                        <p className="text-muted-foreground">Curated items just for you.</p>
                    </div>
                    {products.length > 0 && (
                        <div className="hidden md:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            {products.length} Products
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            title={product.title}
                            category={product.category}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
