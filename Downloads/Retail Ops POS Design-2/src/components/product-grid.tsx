import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plus, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="group qand-hover-subtle cursor-pointer overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => product.inStock && onAddToCart(product)}
              />
              
              {product.discount && (
                <Badge 
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs"
                >
                  -{product.discount}%
                </Badge>
              )}
              
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-not-allowed">
                  <Badge variant="secondary">Нет в наличии</Badge>
                </div>
              )}
              
              {product.inStock && (
                <div className="absolute inset-0 bg-qand-brown/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-qand-brown">
                    Нажмите, чтобы добавить
                  </div>
                </div>
              )}
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={!product.inStock}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all bg-qand-brown hover:bg-qand-brown/90 h-8 w-8 p-0 hover:scale-110"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                >
                  {product.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
              </div>
              
              <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {product.discount ? (
                    <>
                      <span className="font-bold text-qand-brown">
                        {Math.round(product.price * (1 - product.discount / 100))}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {product.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-qand-brown">{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}