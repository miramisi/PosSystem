import { useState } from "react";
import { CollapsibleSidebar } from "./components/collapsible-sidebar";
import { ProductGrid } from "./components/product-grid";
import { ShoppingCart } from "./components/shopping-cart";
import { CategoryFilter } from "./components/category-filter";
import { EnhancedSalesPage } from "./components/enhanced-sales-page";
import { AnalyticsDashboard } from "./components/analytics-dashboard";
import { GiftBoxBuilder } from "./components/gift-box-builder";
import { CustomerManagement } from "./components/customer-management";
import { Settings } from "./components/settings";
import { ErrorBoundary } from "./components/error-boundary";
import { Button } from "./components/ui/button";
import { toast } from "sonner@2.0.3";

// Шоколадные товары
const chocolateProducts = [
  {
    id: "1",
    name: "Трюфель с коньяком",
    price: 85,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Трюфели",
    rating: 4.9,
    inStock: true,
    description: "Нежный трюфель с французским коньяком, покрытый темным шоколадом",
    allergens: ["Молоко", "Алкоголь"]
  },
  {
    id: "2",
    name: "Пралине с фундуком",
    price: 75,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Пралине",
    rating: 4.8,
    inStock: true,
    description: "Хрустящее пралине с обжаренным фундуком в молочном шоколаде",
    allergens: ["Молоко", "Орехи"]
  },
  {
    id: "3",
    name: "Темный шоколад 85%",
    price: 65,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Темный шоколад",
    rating: 4.7,
    inStock: true,
    discount: 10,
    description: "Насыщенный темный шоколад с содержанием какао 85%",
    allergens: []
  },
  {
    id: "4",
    name: "Карамель с морской солью",
    price: 70,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Карамель",
    rating: 4.6,
    inStock: true,
    description: "Нежная карамель с хлопьями морской соли в молочном шоколаде",
    allergens: ["Молоко"]
  },
  {
    id: "5",
    name: "Белый шоколад с малиной",
    price: 80,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Белый шоколад",
    rating: 4.5,
    inStock: true,
    description: "Нежный белый шоколад с кусочками сублимированной малины",
    allergens: ["Молоко"]
  },
  {
    id: "6",
    name: "Ганаш с лавандой",
    price: 90,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Ганаш",
    rating: 4.4,
    inStock: false,
    description: "Изысканный ганаш с цветами лаванды и темным шоколадом",
    allergens: ["Молоко"]
  },
  {
    id: "7",
    name: "Молочный шоколад классический",
    price: 60,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Молочный шоколад",
    rating: 4.3,
    inStock: true,
    description: "Классический молочный шоколад с нежным вкусом",
    allergens: ["Молоко"]
  },
  {
    id: "8",
    name: "Мадлен с шоколадом",
    price: 95,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Специальные",
    rating: 4.8,
    inStock: true,
    discount: 15,
    description: "Французский мадлен, покрытый темным бельгийским шоколадом",
    allergens: ["Молоко", "Глютен", "Яйца"]
  },
  // Дополнительные позиции для демонстрации фильтрации
  {
    id: "9",
    name: "Трюфель с ромом",
    price: 88,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Трюфели",
    rating: 4.6,
    inStock: true,
    description: "Ароматный трюфель с карибским ромом и нотами ванили",
    allergens: ["Молоко", "Алкоголь"]
  },
  {
    id: "10",
    name: "Пралине с миндалем",
    price: 78,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Пралине",
    rating: 4.7,
    inStock: true,
    description: "Деликатесное пралине с калифорнийским миндалем",
    allergens: ["Молоко", "Орехи"]
  },
  {
    id: "11",
    name: "Темный шоколад с апельсином",
    price: 72,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Темный шоколад",
    rating: 4.5,
    inStock: true,
    description: "Темный шоколад 70% с цедрой сицилийского апельсина",
    allergens: []
  },
  {
    id: "12", 
    name: "Карамель с кофе",
    price: 74,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Карамель",
    rating: 4.4,
    inStock: false,
    description: "Карамель с эспрессо и нотами жареного кофе",
    allergens: ["Молоко", "Кофеин"]
  },
  {
    id: "13",
    name: "Белый шоколад с лимоном",
    price: 82,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Белый шоколад",
    rating: 4.3,
    inStock: true,
    description: "Освежающий белый шоколад с цедрой органического лимона",
    allergens: ["Молоко"]
  },
  {
    id: "14",
    name: "Ганаш с розой",
    price: 95,
    image: "https://images.unsplash.com/photo-1731971190289-8e6a5263f434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib25ib25zJTIwbHV4dXJ5fGVufDF8fHx8MTc1OTA0Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Ганаш",
    rating: 4.9,
    inStock: true,
    description: "Изысканный ганаш с лепестками дамасской розы",
    allergens: ["Молоко"]
  },
  {
    id: "15",
    name: "Молочный с карамелью",
    price: 68,
    image: "https://images.unsplash.com/photo-1729875749042-695a49842f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjB0cnVmZmxlcyUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Молочный шоколад",
    rating: 4.2,
    inStock: true,
    description: "Молочный шоколад с жидкой карамельной начинкой",
    allergens: ["Молоко"]
  }
];

const chocolateCategories = [
  { id: "truffles", name: "Трюфели", count: 2 },
  { id: "praline", name: "Пралине", count: 2 },
  { id: "dark", name: "Темный шоколад", count: 2 },
  { id: "caramel", name: "Карамель", count: 2 },
  { id: "white", name: "Белый шоколад", count: 2 },
  { id: "ganache", name: "Ганаш", count: 2 },
  { id: "milk", name: "Молочный шоколад", count: 2 },
  { id: "special", name: "Специальные", count: 1 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("sales");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredProducts = activeCategory === "all" 
    ? chocolateProducts 
    : chocolateProducts.filter(product => {
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
      });

  const addToCart = (product: any) => {
    try {
      if (!product || !product.id) {
        toast.error("Ошибка добавления товара");
        return;
      }

      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast.success(`${product.name} добавлен в корзину (${existingItem.quantity + 1} шт)`);
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
        if (product.isGiftBox) {
          toast.success(`Подарочная коробка добавлена в корзину`);
        } else {
          toast.success(`✨ ${product.name} добавлен в корзину`);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Ошибка при добавлении товара в корзину");
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success(`${item?.name} удален из корзины`);
  };

  const handleCheckout = (paymentMethod: 'card' | 'cash' | 'transfer', paymentData?: any) => {
    try {
      if (!cartItems || cartItems.length === 0) {
        toast.error("Корзина пуста");
        return;
      }

      const subtotal = cartItems.reduce((sum, item) => {
        const itemPrice = item?.discount 
          ? (item.price || 0) * (1 - (item.discount || 0) / 100)
          : (item.price || 0);
        return sum + (itemPrice * (item.quantity || 0));
      }, 0);
      
      // Применяем скидку клиента если есть
      const customerDiscount = selectedCustomer?.discountLevel || 0;
      const discountAmount = subtotal * (customerDiscount / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      
      const tax = subtotalAfterDiscount * 0.2; // 20% НДС
      const total = subtotalAfterDiscount + tax;
      
      let customerInfo = "";
      if (selectedCustomer?.name) {
        customerInfo = ` для ${selectedCustomer.name}`;
        if (customerDiscount > 0) {
          customerInfo += ` (скидка ${customerDiscount}%)`;
        }
      }
      
      let paymentMethodText = 'картой';
      if (paymentMethod === 'cash') paymentMethodText = 'наличными';
      else if (paymentMethod === 'transfer') paymentMethodText = 'переводом';
      
      let additionalInfo = '';
      if (paymentData?.cashReceived && paymentMethod === 'cash') {
        const change = paymentData.cashReceived - total;
        additionalInfo = change > 0 ? ` (сдача: ${change.toFixed(2)})` : '';
      }
      
      toast.success(
        `Платеж на сумму ${total.toFixed(2)} ${paymentMethodText} проведен успешно${customerInfo}${additionalInfo}!`
      );
      
      setCartItems([]);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Ошибка при оформлении заказа");
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setActiveTab("sales");
    toast.success(`Клиент ${customer.name} выбран для текущей продажи`);
  };

  const renderContent = () => {
    try {
    switch (activeTab) {
      case "sales":
        return (
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              <EnhancedSalesPage
                products={filteredProducts}
                categories={chocolateCategories}
                onAddToCart={addToCart}
                selectedCustomer={selectedCustomer}
                onRemoveCustomer={() => setSelectedCustomer(null)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            <div className="w-80 p-4 border-l">
              <ShoppingCart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
                onRemoveCustomer={() => setSelectedCustomer(null)}
                onViewCustomerDetails={(customer) => {
                  setSelectedCustomer(customer);
                  setActiveTab("customers");
                }}
              />
            </div>
          </div>
        );
      case "giftbox":
        return (
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              <GiftBoxBuilder
                chocolates={chocolateProducts}
                onAddToCart={addToCart}
              />
            </div>
            <div className="w-80 p-4 border-l">
              <ShoppingCart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
                onRemoveCustomer={() => setSelectedCustomer(null)}
                onViewCustomerDetails={(customer) => {
                  setSelectedCustomer(customer);
                  setActiveTab("customers");
                }}
              />
            </div>
          </div>
        );
      case "customers":
        return (
          <div className="flex-1 overflow-y-auto">
            <CustomerManagement onSelectCustomer={handleSelectCustomer} />
          </div>
        );
      case "analytics":
        return (
          <div className="flex-1 overflow-y-auto">
            <AnalyticsDashboard />
          </div>
        );
      case "settings":
        return (
          <div className="flex-1 overflow-y-auto">
            <Settings />
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {activeTab === "products" && "Управление товарами"}
                {activeTab === "transactions" && "История транзакций"}
                {activeTab === "finance" && "Финансовые отчеты"}
              </h2>
              <p className="text-muted-foreground">
                Раздел находится в разработке
              </p>
            </div>
          </div>
        );
    }
    } catch (error) {
      console.error("Render error:", error);
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-destructive">
              Произошла ошибка
            </h2>
            <p className="text-muted-foreground mb-4">
              Попробуйте обновить страницу или выберите другой раздел
            </p>
            <Button onClick={() => window.location.reload()}>
              Обновить страницу
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-background">
        <ErrorBoundary>
          <CollapsibleSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            cartItemCount={cartItems.length}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </ErrorBoundary>
        <div className="flex-1 flex flex-col">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}