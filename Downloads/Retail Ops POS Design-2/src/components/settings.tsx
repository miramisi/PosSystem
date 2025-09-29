import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Save, Package, Gift, Settings as SettingsIcon, Palette, Bell } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface GiftBoxSettings {
  sizes: Array<{
    id: string;
    name: string;
    capacity: number;
    price: number;
    dimensions: string;
    enabled: boolean;
  }>;
  decorations: Array<{
    id: string;
    name: string;
    price: number;
    enabled: boolean;
  }>;
  ribbons: Array<{
    id: string;
    name: string;
    color: string;
    price: number;
    enabled: boolean;
  }>;
  cards: Array<{
    id: string;
    name: string;
    price: number;
    enabled: boolean;
  }>;
  personalizations: Array<{
    id: string;
    name: string;
    price: number;
    enabled: boolean;
  }>;
}

interface SystemSettings {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  taxRate: number;
  currency: string;
  notifications: {
    lowStock: boolean;
    newOrders: boolean;
    customerUpdates: boolean;
  };
  giftBoxSettings: GiftBoxSettings;
}

const defaultSettings: SystemSettings = {
  businessName: "QAND Artisan Chocolate",
  businessAddress: "ул. Шота Руставели, 15, Ташкент",
  businessPhone: "+998 71 123 4567",
  businessEmail: "info@qand.uz",
  taxRate: 20,
  currency: "",
  notifications: {
    lowStock: true,
    newOrders: true,
    customerUpdates: false,
  },
  giftBoxSettings: {
    sizes: [
      { id: "small", name: "Маленькая (6 конфет)", capacity: 6, price: 50, dimensions: "15x15x5 см", enabled: true },
      { id: "medium", name: "Средняя (12 конфет)", capacity: 12, price: 75, dimensions: "20x20x6 см", enabled: true },
      { id: "large", name: "Большая (24 конфеты)", capacity: 24, price: 100, dimensions: "30x20x7 см", enabled: true },
      { id: "premium", name: "Премиум (36 конфет)", capacity: 36, price: 150, dimensions: "35x25x8 см", enabled: true },
    ],
    decorations: [
      { id: "basic", name: "Базовое оформление", price: 0, enabled: true },
      { id: "premium", name: "Премиум декор", price: 100, enabled: true },
      { id: "luxury", name: "Люкс декор", price: 200, enabled: true },
      { id: "seasonal", name: "Сезонное оформление", price: 150, enabled: false },
    ],
    ribbons: [
      { id: "gold", name: "Золотая лента", color: "#d4af37", price: 25, enabled: true },
      { id: "brown", name: "Коричневая лента", color: "#8b4513", price: 20, enabled: true },
      { id: "cream", name: "Кремовая лента", color: "#f5f0e8", price: 20, enabled: true },
      { id: "red", name: "Красная лента", color: "#dc2626", price: 30, enabled: true },
      { id: "none", name: "Без ленты", color: "transparent", price: 0, enabled: true },
    ],
    cards: [
      { id: "none", name: "Без открытки", price: 0, enabled: true },
      { id: "simple", name: "Простая открытка", price: 15, enabled: true },
      { id: "premium", name: "Премиум открытка", price: 35, enabled: true },
      { id: "custom", name: "Персональная открытка", price: 50, enabled: true },
    ],
    personalizations: [
      { id: "none", name: "Без персонализации", price: 0, enabled: true },
      { id: "engraving", name: "Гравировка на коробке", price: 100, enabled: true },
      { id: "photo", name: "Фото на открытке", price: 75, enabled: true },
      { id: "message", name: "Персональное сообщение", price: 25, enabled: true },
    ],
  },
};

interface SettingsProps {
  onSettingsChange?: (settings: SystemSettings) => void;
}

export function Settings({ onSettingsChange }: SettingsProps) {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    // Сохранить настройки в localStorage
    localStorage.setItem("qand-pos-settings", JSON.stringify(settings));
    onSettingsChange?.(settings);
    toast.success("Настройки сохранены успешно");
  };

  const updateBusinessSettings = (field: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNotificationSettings = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const updateGiftBoxItem = (category: keyof GiftBoxSettings, itemId: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      giftBoxSettings: {
        ...prev.giftBoxSettings,
        [category]: prev.giftBoxSettings[category].map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="qand-brand-text text-2xl">Настройки системы</h1>
          <p className="text-muted-foreground mt-1">
            Конфигурация POS-системы и параметров подарочных коробок
          </p>
        </div>
        <Button onClick={handleSave} className="bg-qand-brown hover:bg-qand-brown/90">
          <Save className="h-4 w-4 mr-2" />
          Сохранить
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Общие
          </TabsTrigger>
          <TabsTrigger value="giftbox" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Подарочные коробки
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Внешний вид
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о компании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Название компании</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => updateBusinessSettings("businessName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => updateBusinessSettings("businessEmail", e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="businessAddress">Адрес</Label>
                <Textarea
                  id="businessAddress"
                  value={settings.businessAddress}
                  onChange={(e) => updateBusinessSettings("businessAddress", e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="businessPhone">Телефон</Label>
                  <Input
                    id="businessPhone"
                    value={settings.businessPhone}
                    onChange={(e) => updateBusinessSettings("businessPhone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Налоговая ставка (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => updateBusinessSettings("taxRate", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Валюта</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => updateBusinessSettings("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Без валюты</SelectItem>
                      <SelectItem value="$">Доллар ($)</SelectItem>
                      <SelectItem value="€">Евро (€)</SelectItem>
                      <SelectItem value="сум">Сум (сум)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="giftbox" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Размеры коробок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.giftBoxSettings.sizes.map((size) => (
                  <div key={size.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={size.enabled}
                        onCheckedChange={(checked) => updateGiftBoxItem("sizes", size.id, "enabled", checked)}
                      />
                      <div>
                        <p className="font-medium">{size.name}</p>
                        <p className="text-sm text-muted-foreground">{size.dimensions}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <Label className="text-xs">Вместимость</Label>
                        <Input
                          type="number"
                          value={size.capacity}
                          onChange={(e) => updateGiftBoxItem("sizes", size.id, "capacity", Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Цена</Label>
                        <Input
                          type="number"
                          value={size.price}
                          onChange={(e) => updateGiftBoxItem("sizes", size.id, "price", Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ленты и украшения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.giftBoxSettings.ribbons.map((ribbon) => (
                  <div key={ribbon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={ribbon.enabled}
                        onCheckedChange={(checked) => updateGiftBoxItem("ribbons", ribbon.id, "enabled", checked)}
                      />
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: ribbon.color }}
                        />
                        <span className="font-medium">{ribbon.name}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Цена</Label>
                      <Input
                        type="number"
                        value={ribbon.price}
                        onChange={(e) => updateGiftBoxItem("ribbons", ribbon.id, "price", Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Персонализация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.giftBoxSettings.personalizations.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={(checked) => updateGiftBoxItem("personalizations", item.id, "enabled", checked)}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div>
                      <Label className="text-xs">Цена</Label>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateGiftBoxItem("personalizations", item.id, "price", Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Низкий остаток товара</p>
                  <p className="text-sm text-muted-foreground">Уведомления при критически низком остатке</p>
                </div>
                <Switch
                  checked={settings.notifications.lowStock}
                  onCheckedChange={(checked) => updateNotificationSettings("lowStock", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Новые заказы</p>
                  <p className="text-sm text-muted-foreground">Звуковое уведомление о новых заказах</p>
                </div>
                <Switch
                  checked={settings.notifications.newOrders}
                  onCheckedChange={(checked) => updateNotificationSettings("newOrders", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Обновления клиентов</p>
                  <p className="text-sm text-muted-foreground">Уведомления об изменениях в профилях клиентов</p>
                </div>
                <Switch
                  checked={settings.notifications.customerUpdates}
                  onCheckedChange={(checked) => updateNotificationSettings("customerUpdates", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки внешнего вида</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Настройки темы и внешнего вида будут добавлены в следующих версиях
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}