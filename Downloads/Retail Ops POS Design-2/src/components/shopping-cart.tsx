import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CustomerCard } from "./customer-card";
import { CustomerEditForm } from "./customer-edit-form";
import { CheckoutForm } from "./checkout-form";
import { Minus, Plus, Trash2, CreditCard, Banknote, Search, UserPlus, User, X, Eye } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  discountLevel: number;
  totalSpent: number;
  customerGroup: string;
  avatar?: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (paymentMethod: 'card' | 'cash' | 'transfer', paymentData?: any) => void;
  selectedCustomer?: Customer;
  onSelectCustomer?: (customer: Customer) => void;
  onRemoveCustomer?: () => void;
  onViewCustomerDetails?: (customer: Customer) => void;
}

export function ShoppingCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  selectedCustomer,
  onSelectCustomer,
  onRemoveCustomer,
  onViewCustomerDetails
}: ShoppingCartProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isViewingCustomer, setIsViewingCustomer] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Преобразование упрощенного Customer в полный CustomerData для формы
  const convertToCustomerData = (customer: Customer) => ({
    id: customer.id,
    name: customer.name,
    avatar: customer.avatar,
    email: customer.email,
    phone: customer.phone,
    birthday: "",
    joinDate: new Date().toISOString().split('T')[0],
    discountLevel: customer.discountLevel,
    totalSpent: customer.totalSpent,
    balance: 0,
    orders: [],
    relations: [],
    socialMedia: {},
    preferences: {
      favoriteTypes: [],
      favoriteDrink: "",
      allergies: []
    },
    loyaltyPoints: 0,
    nextLevelSpend: 0,
    customerGroup: customer.customerGroup as 'B2B' | 'B2B2C' | 'B2C' | 'B2G' | 'Other'
  });
  
  // Преобразование полного CustomerData обратно в упрощенный Customer
  const convertFromCustomerData = (customerData: any): Customer => ({
    id: customerData.id,
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    discountLevel: customerData.discountLevel,
    totalSpent: customerData.totalSpent,
    customerGroup: customerData.customerGroup,
    avatar: customerData.avatar
  });
  
  // Мок данные клиентов для поиска
  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "Анна Петрова",
      email: "anna.petrova@email.com",
      phone: "+7 (999) 123-45-67",
      discountLevel: 15,
      totalSpent: 47850,
      customerGroup: "B2C"
    },
    {
      id: "2",
      name: "Михаил Сидоров",
      email: "m.sidorov@email.com",
      phone: "+7 (999) 234-56-78",
      discountLevel: 20,
      totalSpent: 85200,
      customerGroup: "B2B"
    },
    {
      id: "3",
      name: "София Петрова",
      email: "sofia.petrova@family.local",
      phone: "",
      discountLevel: 0,
      totalSpent: 0,
      customerGroup: "B2C"
    }
  ];

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.discount 
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  // Применяем скидку клиента если есть
  const customerDiscount = selectedCustomer?.discountLevel || 0;
  const discountAmount = subtotal * (customerDiscount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  
  const tax = subtotalAfterDiscount * 0.2; // 20% НДС
  const total = subtotalAfterDiscount + tax;
  
  return (
    <Card className="h-full flex flex-col qand-subtle-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Корзина</span>
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      {/* Поиск и выбор клиента */}
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="text-sm font-medium">Клиент</div>
          
          {selectedCustomer ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{selectedCustomer.name}</p>
                    {selectedCustomer.discountLevel > 0 && (
                      <p className="text-xs text-qand-brown">Скидка {selectedCustomer.discountLevel}%</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveCustomer}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <Dialog open={isViewingCustomer} onOpenChange={setIsViewingCustomer}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                    <Eye className="h-3 w-3 mr-2" />
                    Подробно
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Информация о клиенте</DialogTitle>
                    <DialogDescription>
                      Подробная информация о клиенте {selectedCustomer?.name}
                    </DialogDescription>
                  </DialogHeader>
                  {selectedCustomer && (
                    <CustomerCard
                      customer={convertToCustomerData(selectedCustomer)}
                      onBack={() => setIsViewingCustomer(false)}
                      onEdit={(updatedCustomer) => {
                        onSelectCustomer?.(convertFromCustomerData(updatedCustomer));
                        setIsViewingCustomer(false);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                <Input
                  placeholder="Поиск клиента..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
              
              {customerSearch && (
                <ScrollArea className="max-h-32">
                  <div className="space-y-1">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center space-x-2 p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => {
                          onSelectCustomer?.(customer);
                          setCustomerSearch("");
                        }}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{customer.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {customer.email}
                            {customer.discountLevel > 0 && ` • ${customer.discountLevel}% скидка`}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <p className="text-xs text-muted-foreground p-2">Клиенты не найдены</p>
                    )}
                  </div>
                </ScrollArea>
              )}
              
              <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    <UserPlus className="h-3 w-3 mr-2" />
                    Создать нового клиента
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Новый клиент</DialogTitle>
                    <DialogDescription>
                      Создание нового клиента для привязки к продаже
                    </DialogDescription>
                  </DialogHeader>
                  <CustomerEditForm
                    customer={{
                      id: `new_${Date.now()}`,
                      name: "",
                      avatar: "",
                      email: "",
                      phone: "",
                      birthday: "",
                      joinDate: new Date().toISOString().split('T')[0],
                      discountLevel: 0,
                      totalSpent: 0,
                      balance: 0,
                      orders: [],
                      relations: [],
                      socialMedia: {},
                      preferences: {
                        favoriteTypes: [],
                        favoriteDrink: "",
                        allergies: []
                      },
                      loyaltyPoints: 0,
                      nextLevelSpend: 0,
                      customerGroup: 'B2C'
                    }}
                    onSave={(newCustomer) => {
                      onSelectCustomer?.(convertFromCustomerData(newCustomer));
                      setIsAddingCustomer(false);
                    }}
                    onCancel={() => setIsAddingCustomer(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <Separator className="mt-3" />
      </CardContent>
      
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Корзина пуста
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 py-2">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs truncate">{item.name}</h4>
                    <div className="flex items-center space-x-1">
                      {item.discount ? (
                        <>
                          <span className="text-xs font-medium text-qand-brown">
                            {Math.round(item.price * (1 - item.discount / 100))}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-qand-brown">{item.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-2 w-2" />
                    </Button>
                    
                    <span className="text-xs w-6 text-center">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-2 w-2" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {items.length > 0 && (
          <div className="space-y-4 pt-4 mt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Подытог:</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              {selectedCustomer && selectedCustomer.discountLevel > 0 && (
                <div className="flex justify-between text-sm text-qand-brown">
                  <span>Скидка клиента ({selectedCustomer.discountLevel}%):</span>
                  <span>-{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>НДС (20%):</span>
                <span>{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Итого:</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
            
            <Dialog open={isCheckingOut} onOpenChange={setIsCheckingOut}>
              <DialogTrigger asChild>
                <Button className="w-full bg-qand-brown hover:bg-qand-brown/90">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Оплатить
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Оформление заказа</DialogTitle>
                  <DialogDescription>
                    Выберите способ оплаты и завершите покупку
                  </DialogDescription>
                </DialogHeader>
                <CheckoutForm
                  items={items}
                  customer={selectedCustomer}
                  onConfirm={(paymentData) => {
                    onCheckout(paymentData.paymentMethod, paymentData);
                    setIsCheckingOut(false);
                  }}
                  onCancel={() => setIsCheckingOut(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}