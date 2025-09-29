import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CustomerCard } from "./customer-card";
import { CustomerEditForm } from "./customer-edit-form";
import { 
  Search, 
  Plus, 
  Edit, 
  Phone, 
  Mail, 
  Calendar, 
  Gift, 
  Heart,
  Star,
  TrendingUp,
  Package,
  Eye,
  Users,
  Upload,
  Camera,
  X
} from "lucide-react";
import { toast } from "sonner@2.0.3";

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

interface Customer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  birthday: string;
  joinDate: string;
  discountLevel: number;
  totalSpent: number;
  balance: number;
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
  // Backwards compatibility
  dateOfBirth?: string;
  anniversaryDate?: string;
  notes?: string;
  loyaltyTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  purchaseCount?: number;
  lastPurchase?: string;
  favoriteChocolates?: string[];
}

interface CustomerManagementProps {
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerManagement({ onSelectCustomer }: CustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Анна Петрова",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      email: "anna.petrova@email.com",
      phone: "+7 (999) 123-45-67",
      birthday: "1985-06-15",
      joinDate: "2023-01-20",
      discountLevel: 15,
      totalSpent: 47850,
      balance: 2500,
      loyaltyPoints: 1435,
      nextLevelSpend: 2150,
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
    },
    {
      id: "2",
      name: "Михаил Сидоров",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      email: "m.sidorov@email.com",
      phone: "+7 (999) 234-56-78",
      birthday: "1978-03-22",
      joinDate: "2022-11-10",
      discountLevel: 20,
      totalSpent: 85200,
      balance: -150,
      loyaltyPoints: 2840,
      nextLevelSpend: 0,
      lastOrder: {
        id: "ord_124",
        date: "2024-12-22",
        total: 680,
        items: [
          { name: "Молочный с карамелью", quantity: 4, price: 68 },
          { name: "Пралине с миндалем", quantity: 6, price: 78 }
        ],
        paymentMethod: 'cash'
      },
      orders: [
        {
          id: "ord_124",
          date: "2024-12-22",
          total: 680,
          items: [
            { name: "Молочный с карамелью", quantity: 4, price: 68 },
            { name: "Пралине с миндалем", quantity: 6, price: 78 }
          ],
          paymentMethod: 'cash'
        }
      ],
      relations: [],
      socialMedia: {
        instagram: "@mikhail_sid"
      },
      preferences: {
        favoriteTypes: ["Молочный шоколад", "Карамель", "Пралине"],
        favoriteDrink: "Эспрессо",
        allergies: []
      },
      customerGroup: 'B2B'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit'>('list');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    preferences: { favoriteTypes: [], favoriteDrink: '', allergies: [] },
    socialMedia: {},
    relations: [],
    orders: []
  });
  const [customerAvatar, setCustomerAvatar] = useState<string>("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-amber-100 text-amber-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUpcomingEvents = (customer: Customer) => {
    const events = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    
    if (customer.birthday || customer.dateOfBirth) {
      const birthday = new Date(customer.birthday || customer.dateOfBirth!);
      birthday.setFullYear(currentYear);
      if (birthday < today) birthday.setFullYear(currentYear + 1);
      
      const daysUntil = Math.ceil((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 30) {
        events.push({ type: 'birthday', date: birthday, daysUntil });
      }
    }
    
    if (customer.anniversaryDate) {
      const anniversary = new Date(customer.anniversaryDate);
      anniversary.setFullYear(currentYear);
      if (anniversary < today) anniversary.setFullYear(currentYear + 1);
      
      const daysUntil = Math.ceil((anniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 30) {
        events.push({ type: 'anniversary', date: anniversary, daysUntil });
      }
    }
    
    return events;
  };

  const getOppositeRelationship = (relationship: string): string => {
    const relationshipMap: { [key: string]: string } = {
      'Супруг': 'Супруга',
      'Супруга': 'Супруг',
      'Муж': 'Жена',
      'Жена': 'Муж',
      'Сын': 'Отец',
      'Дочь': 'Мать',
      'Отец': 'Сын',
      'Мать': 'Дочь',
      'Брат': 'Брат/Сестра',
      'Сестра': 'Брат/Сестра',
      'Дедушка': 'Внук/Внучка',
      'Бабушка': 'Внук/Внучка',
      'Внук': 'Дедушка/Бабушка',
      'Внучка': 'Дедушка/Бабушка'
    };
    
    return relationshipMap[relationship] || 'Родственник';
  };

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      avatar: customerAvatar || undefined,
      email: newCustomer.email,
      phone: newCustomer.phone || "",
      birthday: newCustomer.birthday || new Date().toISOString().split('T')[0],
      joinDate: new Date().toISOString().split('T')[0],
      discountLevel: 5,
      totalSpent: 0,
      balance: 0,
      loyaltyPoints: 0,
      nextLevelSpend: 10000,
      orders: [],
      relations: [],
      socialMedia: newCustomer.socialMedia || {},
      preferences: newCustomer.preferences || {
        favoriteTypes: [],
        favoriteDrink: '',
        allergies: []
      },
      customerGroup: (newCustomer.customerGroup as 'B2B' | 'B2B2C' | 'B2C' | 'B2G' | 'Other') || 'B2C'
    };

    setCustomers(prev => [...prev, customer]);
    setIsAddingCustomer(false);
    setNewCustomer({
      preferences: { favoriteTypes: [], favoriteDrink: '', allergies: [] },
      socialMedia: {},
      relations: [],
      orders: []
    });
    setCustomerAvatar("");
    toast.success("Клиент добавлен успешно");
  };

  if (viewMode === 'detail' && selectedCustomer) {
    return (
      <CustomerCard 
        customer={selectedCustomer}
        onBack={() => {
          setViewMode('list');
          setSelectedCustomer(null);
        }}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          setViewMode('edit');
        }}
      />
    );
  }

  if (viewMode === 'edit' && selectedCustomer) {
    return (
      <CustomerEditForm 
        customer={selectedCustomer}
        onSave={(updatedCustomer) => {
          // Обновляем основного клиента
          setCustomers(prevCustomers => {
            let newCustomers = prevCustomers.map(c => 
              c.id === updatedCustomer.id ? updatedCustomer : c
            );

            // Проверяем и создаем новых родственников как отдельных клиентов
            updatedCustomer.relations.forEach(relation => {
              const existingRelation = newCustomers.find(c => c.name === relation.name);
              
              if (!existingRelation && relation.birthday) {
                // Создаем нового клиента для родственника
                const newRelativeCustomer: Customer = {
                  id: `rel_customer_${Date.now()}_${Math.random()}`,
                  name: relation.name,
                  avatar: relation.avatar,
                  email: `${relation.name.toLowerCase().replace(/\s+/g, '.')}@family.local`,
                  phone: "",
                  birthday: relation.birthday,
                  joinDate: new Date().toISOString().split('T')[0],
                  discountLevel: 0,
                  totalSpent: 0,
                  balance: 0,
                  loyaltyPoints: 0,
                  nextLevelSpend: 10000,
                  orders: [],
                  relations: [{
                    id: updatedCustomer.id,
                    name: updatedCustomer.name,
                    relationship: getOppositeRelationship(relation.relationship),
                    avatar: updatedCustomer.avatar,
                    birthday: updatedCustomer.birthday
                  }],
                  socialMedia: {},
                  preferences: {
                    favoriteTypes: [],
                    favoriteDrink: '',
                    allergies: []
                  },
                  customerGroup: 'B2C'
                };
                
                newCustomers.push(newRelativeCustomer);
              } else if (existingRelation) {
                // Обновляем связи у существующего родственника
                newCustomers = newCustomers.map(c => {
                  if (c.name === relation.name) {
                    const hasRelation = c.relations.some(r => r.id === updatedCustomer.id);
                    if (!hasRelation) {
                      return {
                        ...c,
                        relations: [...c.relations, {
                          id: updatedCustomer.id,
                          name: updatedCustomer.name,
                          relationship: getOppositeRelationship(relation.relationship),
                          avatar: updatedCustomer.avatar,
                          birthday: updatedCustomer.birthday
                        }]
                      };
                    }
                  }
                  return c;
                });
              }
            });

            return newCustomers;
          });
          
          setSelectedCustomer(updatedCustomer);
          setViewMode('detail');
        }}
        onCancel={() => {
          setViewMode('detail');
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">База клиентов</h2>
        <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить клиента
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Новый клиент</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Фото клиента */}
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-qand-cream/30">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-qand-brown/20">
                    {customerAvatar ? (
                      <AvatarImage src={customerAvatar} alt="Фото клиента" />
                    ) : (
                      <AvatarFallback className="text-2xl bg-qand-brown/10 text-qand-brown">
                        {newCustomer.name ? newCustomer.name.split(' ').map(n => n[0]).join('') : <Camera className="h-8 w-8" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {customerAvatar && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => setCustomerAvatar("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setCustomerAvatar(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Загрузить фото
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Генерируем случайный аватар из Unsplash
                      const portraits = [
                        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                      ];
                      const randomPortrait = portraits[Math.floor(Math.random() * portraits.length)];
                      setCustomerAvatar(randomPortrait);
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Случайное фото
                  </Button>
                </div>
              </div>

              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Полное имя *</Label>
                    <Input
                      id="name"
                      value={newCustomer.name || ""}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Иван Петрович Сидоров"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email адрес *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email || ""}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ivan.sidorov@email.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Номер телефона</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone || ""}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+7 (999) 123-45-67"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="birthday">Дата рождения</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={newCustomer.birthday || ""}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, birthday: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerGroup">Тип клиента</Label>
                    <Select
                      value={newCustomer.customerGroup || "B2C"}
                      onValueChange={(value) => setNewCustomer(prev => ({ ...prev, customerGroup: value as any }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Выберите тип клиента" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2C">Частный клиент (B2C)</SelectItem>
                        <SelectItem value="B2B">Корпоративный (B2B)</SelectItem>
                        <SelectItem value="B2B2C">Партнёр (B2B2C)</SelectItem>
                        <SelectItem value="B2G">Госзаказ (B2G)</SelectItem>
                        <SelectItem value="Other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="favoriteDrink">Любимый напиток</Label>
                    <Input
                      id="favoriteDrink"
                      value={newCustomer.preferences?.favoriteDrink || ""}
                      onChange={(e) => setNewCustomer(prev => ({ 
                        ...prev, 
                        preferences: { 
                          ...prev.preferences, 
                          favoriteDrink: e.target.value,
                          favoriteTypes: prev.preferences?.favoriteTypes || [],
                          allergies: prev.preferences?.allergies || []
                        } 
                      }))}
                      placeholder="Капучино, Эспрессо, Чай..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Социальные сети */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium">Социальные сети (необязательно)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={newCustomer.socialMedia?.instagram || ""}
                      onChange={(e) => setNewCustomer(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          instagram: e.target.value
                        }
                      }))}
                      placeholder="@username"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={newCustomer.socialMedia?.facebook || ""}
                      onChange={(e) => setNewCustomer(prev => ({
                        ...prev,
                        socialMedia: {
                          ...prev.socialMedia,
                          facebook: e.target.value
                        }
                      }))}
                      placeholder="facebook.username"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" size="lg" onClick={() => {
                  setIsAddingCustomer(false);
                  setCustomerAvatar("");
                }}>
                  Отмена
                </Button>
                <Button size="lg" onClick={addCustomer} className="bg-qand-brown hover:bg-qand-brown/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить клиента
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Поиск клиентов..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список клиентов */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Клиенты ({filteredCustomers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredCustomers.map((customer) => {
                    const upcomingEvents = getUpcomingEvents(customer);
                    return (
                      <div
                        key={customer.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                          selectedCustomer?.id === customer.id ? 'bg-muted border-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setViewMode('detail');
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            {customer.avatar && (
                              <AvatarImage src={customer.avatar} alt={customer.name} />
                            )}
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">{customer.name}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {customer.totalSpent.toLocaleString()}
                              </span>
                              <div className="flex items-center space-x-1">
                                {customer.discountLevel > 0 && (
                                  <Badge variant="outline" className={`text-xs ${customer.discountLevel >= 20 ? 'bg-qand-rose text-white' : customer.discountLevel >= 15 ? 'bg-qand-purple text-white' : customer.discountLevel >= 10 ? 'bg-qand-sky text-white' : 'bg-qand-mint text-white'}`}>
                                    {customer.discountLevel}%
                                  </Badge>
                                )}
                                {upcomingEvents.length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    {upcomingEvents.map((event, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {event.type === 'birthday' ? '🎂' : '💕'} {event.daysUntil}д
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Детали клиента */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      {selectedCustomer.avatar && (
                        <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                      )}
                      <AvatarFallback>
                        {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedCustomer.name}</CardTitle>
                      {selectedCustomer.discountLevel > 0 && (
                        <Badge variant="secondary" className={`${selectedCustomer.discountLevel >= 20 ? 'bg-qand-rose text-white' : selectedCustomer.discountLevel >= 15 ? 'bg-qand-purple text-white' : selectedCustomer.discountLevel >= 10 ? 'bg-qand-sky text-white' : 'bg-qand-mint text-white'}`}>
                          {selectedCustomer.discountLevel}% скидка
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setViewMode('detail');
                      }}
                      className="shrink-0"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Подробно
                    </Button>
                    <Button 
                      onClick={() => onSelectCustomer(selectedCustomer)}
                      className="shrink-0"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Выбрать клиента
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">Информация</TabsTrigger>
                    <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
                    <TabsTrigger value="history">История</TabsTrigger>
                    <TabsTrigger value="events">События</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.email}</span>
                        </div>
                        {selectedCustomer.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedCustomer.phone}</span>
                          </div>
                        )}
                        {(selectedCustomer.birthday || selectedCustomer.dateOfBirth) && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(selectedCustomer.birthday || selectedCustomer.dateOfBirth!).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.orders.length} покупок</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Последняя: {selectedCustomer.lastOrder ? new Date(selectedCustomer.lastOrder.date).toLocaleDateString('ru-RU') : 'Нет покупок'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedCustomer.notes && (
                      <div>
                        <Label>Заметки</Label>
                        <p className="text-sm text-muted-foreground mt-1">{selectedCustomer.notes}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="space-y-4">
                    <div>
                      <Label>Любимые типы шоколада</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCustomer.preferences.favoriteTypes.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            <Heart className="h-3 w-3 mr-1" />
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Любимый напиток</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          {selectedCustomer.preferences.favoriteDrink || 'Не указан'}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedCustomer.preferences.allergies.length > 0 && (
                      <div>
                        <Label>Аллергии</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCustomer.preferences.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive">
                              ⚠️ {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <div className="text-center py-8 text-muted-foreground">
                      История покупок будет отображаться здесь
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="events" className="space-y-4">
                    {getUpcomingEvents(selectedCustomer).map((event, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {event.type === 'birthday' ? '🎂' : '💕'}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {event.type === 'birthday' ? 'День рождения' : 'Годовщина'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Через {event.daysUntil} дней ({event.date.toLocaleDateString('ru-RU')})
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getUpcomingEvents(selectedCustomer).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Ближайших событий нет
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Выберите клиента</h3>
                  <p className="text-muted-foreground">
                    Выберите клиента из списка для просмотра деталей
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}