import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Heart, 
  Gift, 
  Calendar, 
  Instagram, 
  Facebook, 
  Phone, 
  Mail,
  ArrowLeft,
  Coffee,
  Cake,
  Users,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Star
} from "lucide-react";

interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: 'card' | 'cash';
}

interface CustomerRelation {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  birthday?: string;
}

interface CustomerData {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  birthday: string;
  joinDate: string;
  discountLevel: number;
  totalSpent: number;
  balance: number; // положительный = депозит, отрицательный = задолженность
  lastOrder?: CustomerOrder;
  orders: CustomerOrder[];
  relations: CustomerRelation[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
  };
  preferences: {
    favoriteTypes: string[];
    favoriteDrink: string;
    allergies: string[];
  };
  loyaltyPoints: number;
  nextLevelSpend: number;
  customerGroup: 'B2B' | 'B2B2C' | 'B2C' | 'B2G' | 'Other';
}

interface CustomerCardProps {
  customer: CustomerData;
  onBack: () => void;
  onEdit?: (customer: CustomerData) => void;
}

// Пример данных клиента
const sampleCustomer: CustomerData = {
  id: "1",
  name: "Анна Петрова",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  email: "anna.petrova@example.com",
  phone: "+7 (905) 123-45-67",
  birthday: "1988-03-15",
  joinDate: "2023-01-20",
  discountLevel: 15,
  totalSpent: 47850,
  balance: 2500, // депозит
  loyaltyPoints: 1435,
  nextLevelSpend: 2150, // до 20% скидки
  lastOrder: {
    id: "ord_123",
    date: "2024-12-20",
    total: 1240,
    items: [
      { name: "Трюфель с коньяком", quantity: 6, price: 85 },
      { name: "Подарочная коробка премиум", quantity: 1, price: 730 }
    ],
    paymentMethod: 'card'
  },
  orders: [
    {
      id: "ord_123",
      date: "2024-12-20",
      total: 1240,
      items: [
        { name: "Трюфель с коньяком", quantity: 6, price: 85 },
        { name: "Подарочная коробка премиум", quantity: 1, price: 730 }
      ],
      paymentMethod: 'card'
    },
    {
      id: "ord_122",
      date: "2024-12-10",
      total: 850,
      items: [
        { name: "Пралине с фундуком", quantity: 8, price: 75 },
        { name: "Белый шоколад с малиной", quantity: 2, price: 80 }
      ],
      paymentMethod: 'cash'
    },
    {
      id: "ord_121",
      date: "2024-11-28",
      total: 1650,
      items: [
        { name: "Ганаш с розой", quantity: 10, price: 95 },
        { name: "Темный шоколад 85%", quantity: 12, price: 65 }
      ],
      paymentMethod: 'card'
    }
  ],
  relations: [
    {
      id: "rel_1",
      name: "Михаил Петров",
      relationship: "Супруг",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      birthday: "1982-09-12"
    },
    {
      id: "rel_2", 
      name: "София Петрова",
      relationship: "Дочь",
      avatar: "https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=150&h=150&fit=crop&crop=face",
      birthday: "2010-04-20"
    }
  ],
  socialMedia: {
    instagram: "@anna_petrova",
    facebook: "anna.petrova.7"
  },
  preferences: {
    favoriteTypes: ["Трюфели", "Ганаш", "Темный шоколад"],
    favoriteDrink: "Капучино",
    allergies: ["Орехи"]
  },
  customerGroup: 'B2C'
};

export function CustomerCard({ customer = sampleCustomer, onBack, onEdit }: CustomerCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');

  const getDiscountColor = (level: number) => {
    if (level >= 20) return "bg-qand-rose";
    if (level >= 15) return "bg-qand-purple"; 
    if (level >= 10) return "bg-qand-sky";
    return "bg-qand-mint";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Заголовок с кнопкой назад */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад к клиентам
        </Button>
        <h1 className="flex-1">Карточка клиента</h1>
        {onEdit && (
          <Button variant="outline" onClick={() => onEdit(customer)}>
            Редактировать
          </Button>
        )}
      </div>

      {/* Основная карточка */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Верхняя секция */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Левая часть - Фото, скидка и предпочтения */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="text-2xl bg-primary/10">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-xl">{customer.name}</h2>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {customer.customerGroup}
                  </Badge>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-white ${getDiscountColor(customer.discountLevel)} text-lg px-4 py-2`}
                >
                  <Star className="w-4 h-4 mr-1" />
                  {customer.discountLevel}% скидка
                </Badge>
                
                {/* Предпочтения под скидкой - полностью */}
                <div className="text-center space-y-2">
                  <div className="text-sm">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-3 h-3 text-qand-rose" />
                      <span className="font-medium text-muted-foreground">Любимое</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {customer.preferences.favoriteTypes.join(', ')}
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Coffee className="w-3 h-3 text-qand-brown" />
                      <span className="font-medium text-muted-foreground">Напиток</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {customer.preferences.favoriteDrink}
                    </div>
                  </div>
                </div>

                {/* Важная информация под предпочтениями */}
                <div className="text-center space-y-2">
                  {customer.preferences.allergies.length > 0 ? (
                    <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-qand-rose font-medium">⚠️ Аллергии</span>
                      </div>
                      <div className="text-xs text-qand-rose">
                        {customer.preferences.allergies.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-qand-mint">✓ Аллергий не выявлено</div>
                  )}
                </div>
              </div>
            </div>

            {/* Правая часть - Финансовая информация */}
            <div className="lg:col-span-2 space-y-6">
              {/* Баланс */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-secondary/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <CreditCard className="w-4 h-4" />
                      Баланс
                    </div>
                    <div className={`text-2xl font-semibold ${customer.balance >= 0 ? 'text-qand-mint' : 'text-qand-rose'}`}>
                      {customer.balance >= 0 ? '+' : ''}{formatCurrency(customer.balance)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {customer.balance >= 0 ? 'Депозит' : 'Задолженность'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="w-4 h-4" />
                      Всего потрачено
                    </div>
                    <div className="text-2xl font-semibold text-primary">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      с {formatDate(customer.joinDate)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Последний заказ */}
              {customer.lastOrder && (
                <Card className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShoppingBag className="w-4 h-4" />
                        Последний заказ
                      </div>
                      <Badge variant="outline">
                        {formatDate(customer.lastOrder.date)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          {formatCurrency(customer.lastOrder.total)}
                        </span>
                        <Badge variant="secondary">
                          {customer.lastOrder.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customer.lastOrder.items.map((item, index) => (
                          <div key={index}>
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Семья */}
              {customer.relations.length > 0 && (
                <Card className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Users className="w-4 h-4" />
                      Семья
                    </div>
                    <div className="space-y-2">
                      {customer.relations.map((relation) => (
                        <div key={relation.id} className="flex items-center justify-between bg-background rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={relation.avatar} alt={relation.name} />
                              <AvatarFallback className="text-xs">
                                {relation.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <div className="font-medium">{relation.name}</div>
                              <div className="text-xs text-muted-foreground">{relation.relationship}</div>
                            </div>
                          </div>
                          {relation.birthday && (
                            <div className="text-xs text-muted-foreground">
                              <Cake className="w-3 h-3 inline mr-1" />
                              {formatDate(relation.birthday)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Нижняя секция */}
          <div className="p-6 space-y-6">
            {/* Контакты и социальные сети - перенесены выше */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Контакты */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Контакты</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(customer.birthday)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.socialMedia.instagram && (
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-qand-rose" />
                        <span>{customer.socialMedia.instagram}</span>
                      </div>
                    )}
                    {customer.socialMedia.facebook && (
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-qand-sky" />
                        <span>{customer.socialMedia.facebook}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Дополнительная информация (оставляем для симметрии) */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Дополнительно</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-xs text-muted-foreground">
                      Баллы лояльности: {customer.loyaltyPoints}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Клиент с: {formatDate(customer.joinDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Всего заказов: {customer.orders.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* До следующего уровня скидки */}
            <Card className="bg-secondary/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <TrendingUp className="w-4 h-4" />
                  До следующего уровня скидки
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Осталось потратить</span>
                    <span className="font-semibold">{formatCurrency(customer.nextLevelSpend)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, ((customer.totalSpent % 50000) / 50000) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Баллы лояльности: {customer.loyaltyPoints}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* История заказов */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>История заказов</h3>
              <Badge variant="secondary">{customer.orders.length} заказов</Badge>
            </div>
            
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <Card key={order.id} className="bg-secondary/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{formatCurrency(order.total)}</span>
                            <Badge variant="outline" className="text-xs">
                              {order.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}