import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Plus, 
  Minus, 
  Gift, 
  Package, 
  X, 
  Search, 
  Filter,
  ArrowRight,
  ArrowLeft,
  Check,
  Settings,
  Sparkles,
  Star,
  ShoppingCart,
  Grid3X3,
  List
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ChocolateItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  allergens: string[];
  rating?: number;
  inStock: boolean;
  discount?: number;
}

interface GiftBoxItem {
  chocolate: ChocolateItem;
  quantity: number;
}

interface GiftBoxSettings {
  sizes: Array<{
    id: string;
    name: string;
    capacity: number;
    price: number;
    dimensions: string;
    enabled: boolean;
  }>;
}

interface GiftBoxConfig {
  boxSize: string;
  quantity: number;
}

interface GiftBoxBuilderProps {
  chocolates: ChocolateItem[];
  onAddToCart: (giftBox: any) => void;
}

const defaultGiftBoxSettings: GiftBoxSettings = {
  sizes: [
    { id: "small", name: "Маленькая (6 конфет)", capacity: 6, price: 50, dimensions: "15x15x5 см", enabled: true },
    { id: "medium", name: "Средняя (12 конфет)", capacity: 12, price: 75, dimensions: "20x20x6 см", enabled: true },
    { id: "large", name: "Большая (24 конфеты)", capacity: 24, price: 100, dimensions: "30x20x7 см", enabled: true },
    { id: "premium", name: "Премиум (36 конфет)", capacity: 36, price: 150, dimensions: "35x25x8 см", enabled: true },
  ]
};

export function GiftBoxBuilder({ chocolates, onAddToCart }: GiftBoxBuilderProps) {
  const [selectedChocolates, setSelectedChocolates] = useState<GiftBoxItem[]>([]);
  const [config, setConfig] = useState<GiftBoxConfig>({
    boxSize: "medium",
    quantity: 1
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [settings, setSettings] = useState<GiftBoxSettings>(defaultGiftBoxSettings);
  const [boxSearchQuery, setBoxSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Загрузка настроек из localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage?.getItem("qand-pos-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed?.giftBoxSettings) {
          setSettings(parsed.giftBoxSettings);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Fallback to default settings
      setSettings(defaultGiftBoxSettings);
    }
  }, []);

  // Фильтрация шоколада
  const filteredChocolates = chocolates.filter(chocolate => {
    const matchesSearch = chocolate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chocolate.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || chocolate.category === selectedCategory;
    return matchesSearch && matchesCategory && chocolate.inStock;
  });

  // Получение активных настроек
  const availableSizes = settings.sizes.filter(size => size.enabled);
  
  // Фильтрация коробок по поиску
  const filteredSizes = availableSizes.filter(size => 
    size.name.toLowerCase().includes(boxSearchQuery.toLowerCase())
  );

  const selectedSize = availableSizes.find(size => size.id === config.boxSize) || availableSizes[0];

  const totalSelectedQuantity = selectedChocolates.reduce((sum, item) => sum + item.quantity, 0);
  const chocolatesCost = selectedChocolates.reduce((sum, item) => sum + (item.chocolate.price * item.quantity), 0);
  const totalCost = (chocolatesCost + (selectedSize?.price || 0)) * config.quantity;

  const addChocolate = (chocolate: ChocolateItem) => {
    try {
      if (!chocolate || !chocolate.id) {
        toast.error("Ошибка: некорректные данные товара");
        return;
      }

      if (!selectedSize || totalSelectedQuantity >= selectedSize.capacity) {
        toast.error(`Коробка заполнена! Максимум ${selectedSize?.capacity || 0} конфет.`);
        return;
      }

      const existingItem = selectedChocolates.find(item => item.chocolate.id === chocolate.id);
      
      if (existingItem) {
        setSelectedChocolates(prev =>
          prev.map(item =>
            item.chocolate.id === chocolate.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setSelectedChocolates(prev => [...prev, { chocolate, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error adding chocolate:", error);
      toast.error("Ошибка при добавлении конфеты");
    }
  };

  const removeChocolate = (chocolateId: string) => {
    setSelectedChocolates(prev => prev.filter(item => item.chocolate.id !== chocolateId));
  };

  const updateQuantity = (chocolateId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeChocolate(chocolateId);
      return;
    }

    const currentTotal = selectedChocolates
      .filter(item => item.chocolate.id !== chocolateId)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (selectedSize && currentTotal + newQuantity > selectedSize.capacity) {
      toast.error(`Превышена вместимость коробки! Максимум ${selectedSize.capacity} конфет.`);
      return;
    }

    setSelectedChocolates(prev =>
      prev.map(item =>
        item.chocolate.id === chocolateId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const addToCart = () => {
    try {
      if (!selectedChocolates || selectedChocolates.length === 0) {
        toast.error("Добавьте конфеты в подарочную коробку");
        return;
      }

      if (!selectedSize) {
        toast.error("Выберите размер коробки");
        return;
      }

      const chocolatesList = selectedChocolates.map(item => 
        `${item?.chocolate?.name || 'Неизвестная конфета'} (${item?.quantity || 0} шт)`
      ).join(', ');
      
      const giftBox = {
        id: `giftbox-${Date.now()}`,
        name: `Премиум коробка ${selectedSize.name} (${config.quantity} шт): ${chocolatesList}`,
        price: totalCost,
        isGiftBox: true,
        config: {
          ...config,
          sizeName: selectedSize.name,
        },
        chocolates: selectedChocolates,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwY2hvY29sYXRlfGVufDF8fHx8MTc1OTA0Mjk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      };

      onAddToCart(giftBox);
      
      // Сброс после добавления
      setSelectedChocolates([]);
      
      toast.success("Подарочная коробка добавлена в корзину!");
    } catch (error) {
      console.error("Error adding gift box to cart:", error);
      toast.error("Ошибка при добавлении коробки в корзину");
    }
  };

  const categories = [...new Set(chocolates.map(c => c.category))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Конфигурация коробки - перемещен в верх */}
      <Card className="qand-subtle-shadow mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-qand-brown" />
              Премиум
            </CardTitle>
            <Button 
              onClick={addToCart}
              className="bg-qand-brown hover:bg-qand-brown/90"
              disabled={selectedChocolates.length === 0}
            >
              <Gift className="h-4 w-4 mr-2" />
              Добавить в корзину
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Поиск по коробкам */}
            <div>
              <Label>Поиск коробок</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Найти коробку..."
                  value={boxSearchQuery}
                  onChange={(e) => setBoxSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {boxSearchQuery && filteredSizes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredSizes.map((size) => (
                      <div
                        key={size.id}
                        className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setConfig(prev => ({ ...prev, boxSize: size.id }));
                          setBoxSearchQuery("");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{size.name}</span>
                          <span className="text-qand-brown font-medium">{size.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {size.dimensions} • {size.capacity} конфет
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Выбор коробки */}
            <div>
              <Select value={config.boxSize} onValueChange={(value) => setConfig(prev => ({ ...prev, boxSize: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{size.name}</span>
                        <span className="text-qand-brown font-medium ml-4">{size.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSize && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedSize.dimensions} • Вместимость: {selectedSize.capacity} конфет
                </p>
              )}
            </div>

            {/* Количество коробок - компактная версия */}
            <div>
              <Label className="text-sm">Количество</Label>
              <div className="flex items-center gap-1 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  disabled={config.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={config.quantity}
                  onChange={(e) => setConfig(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="text-center w-16 h-8 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Итого: {totalCost.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Выбранные конфеты - компактный вид */}
          {selectedChocolates.length > 0 && (
            <div className="mt-6 p-4 bg-qand-cream/30 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-qand-gold" />
                  {selectedSize ? `${selectedSize.name} ${config.quantity > 1 ? `(${config.quantity} шт)` : ''}` : 'Выбранные конфеты'}
                </span>
                <Badge variant="outline" className="border-qand-brown text-qand-brown">
                  {totalSelectedQuantity}/{(selectedSize?.capacity || 0) * config.quantity}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedChocolates.map((item) => (
                  <div key={item.chocolate.id} className="flex items-center gap-2 bg-white px-2 py-1 rounded text-sm">
                    <span className="truncate max-w-32">{item.chocolate.name}</span>
                    <Badge variant="secondary" className="text-xs">{item.quantity}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-red-500 hover:text-red-600"
                      onClick={() => removeChocolate(item.chocolate.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Категории конфет - упрощенные */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Категории конфет</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-qand-brown hover:bg-qand-brown/90" : ""}
          >
            Все
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-qand-brown hover:bg-qand-brown/90" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Каталог конфет */}
      <Card className="qand-subtle-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Каталог конфет</CardTitle>
            <div className="flex items-center gap-4">
              {/* Поиск */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск конфет..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
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
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredChocolates.map((chocolate) => (
                <div
                  key={chocolate.id}
                  className="border rounded-lg p-3 qand-hover-subtle cursor-pointer group relative"
                  onClick={() => addChocolate(chocolate)}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={chocolate.image}
                      alt={chocolate.name}
                      className="w-full h-32 object-cover rounded mb-2 transition-all duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-qand-brown/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t flex items-center justify-center">
                      <div className="bg-white/90 px-2 py-1 rounded text-xs font-medium text-qand-brown">
                        Добавить
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{chocolate.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      {chocolate.discount ? (
                        <div>
                          <span className="font-medium text-qand-brown">
                            {Math.round(chocolate.price * (1 - chocolate.discount / 100))}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground line-through">
                              {chocolate.price}
                            </span>
                            <Badge className="bg-qand-rose text-white text-xs">
                              -{chocolate.discount}%
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium text-qand-brown">{chocolate.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChocolates.map((chocolate) => (
                <div
                  key={chocolate.id}
                  className="flex items-center justify-between p-3 border rounded-lg qand-hover-subtle cursor-pointer group"
                  onClick={() => addChocolate(chocolate)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{chocolate.name}</h3>
                    <p className="text-xs text-muted-foreground">{chocolate.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {chocolate.discount ? (
                        <div>
                          <span className="font-medium text-qand-brown">
                            {Math.round(chocolate.price * (1 - chocolate.discount / 100))}
                          </span>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-xs text-muted-foreground line-through">
                              {chocolate.price}
                            </span>
                            <Badge className="bg-qand-rose text-white text-xs">
                              -{chocolate.discount}%
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <span className="font-medium text-qand-brown">{chocolate.price}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredChocolates.length === 0 && (
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