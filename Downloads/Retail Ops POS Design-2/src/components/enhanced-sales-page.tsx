import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CategoryFilter } from "./category-filter";
import { 
  Search, 
  ShoppingCart,
  Grid3X3,
  List,
  X
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  inStock: boolean;
  discount?: number;
  description: string;
  allergens: string[];
}

interface EnhancedSalesPageProps {
  products: Product[];
  categories: Array<{ id: string; name: string; count: number }>;
  onAddToCart: (product: Product) => void;
  selectedCustomer?: any;
  onRemoveCustomer?: () => void;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

type ViewMode = "grid" | "list";

export function EnhancedSalesPage({ 
  products, 
  categories, 
  onAddToCart, 
  selectedCustomer,
  onRemoveCustomer,
  activeCategory = "all",
  onCategoryChange
}: EnhancedSalesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Фильтрация по категории и поиску
  const filteredProducts = products.filter(product => {
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = activeCategory === "all" || (() => {
      const categoryMap: { [key: string]: string } = {
        "truffles": "Трюфели",
        "praline": "Пралине",
        "dark": "Темный шоколад",
        "caramel": "Карамель",
        "white": "Белый шоколад",
        "ganache": "Ганаш",
        "milk": "Молочный шоколад",
        "special": "Специальные"
      };
      return product.category === categoryMap[activeCategory];
    })();
    
    return searchMatch && categoryMatch;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Выбранный клиент */}
      {selectedCustomer && (
        <Card className="qand-subtle-shadow">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-qand-brown text-white flex items-center justify-center font-medium">
                {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCustomer.customerGroup} • {selectedCustomer.totalSpent.toLocaleString()} потрачено
                  {selectedCustomer.discountLevel > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-qand-brown text-white">
                      {selectedCustomer.discountLevel}% скидка
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveCustomer}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Фильтры по категориям */}
      {onCategoryChange && (
        <Card className="qand-subtle-shadow">
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />
        </Card>
      )}

      {/* Поиск и переключатель вида */}
      <Card className="qand-subtle-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск конфет..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Переключатель вида */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-qand-brown hover:bg-qand-brown/90" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-qand-brown hover:bg-qand-brown/90" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Каталог конфет */}
      <Card className="qand-subtle-shadow">
        <CardHeader>
          <CardTitle>Каталог конфет</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-3 qand-hover-subtle cursor-pointer group relative"
                  onClick={() => onAddToCart(product)}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2 transition-all duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-qand-brown/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t flex items-center justify-center">
                      <div className="bg-white/90 px-2 py-1 rounded text-xs font-medium text-qand-brown">
                        Добавить
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount ? (
                        <div>
                          <span className="font-medium text-qand-brown">
                            {Math.round(product.price * (1 - product.discount / 100))}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground line-through">
                              {product.price}
                            </span>
                            <Badge className="bg-qand-rose text-white text-xs">
                              -{product.discount}%
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium text-qand-brown">{product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg qand-hover-subtle cursor-pointer group"
                  onClick={() => onAddToCart(product)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {product.discount ? (
                        <div>
                          <span className="font-medium text-qand-brown">
                            {Math.round(product.price * (1 - product.discount / 100))}
                          </span>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-xs text-muted-foreground line-through">
                              {product.price}
                            </span>
                            <Badge className="bg-qand-rose text-white text-xs">
                              -{product.discount}%
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium text-qand-brown">{product.price}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Конфеты не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить поисковый запрос
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Сбросить поиск
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}