import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  Users, 
  Receipt,
  Crown,
  Wallet,
  Gift,
  Sparkles
} from "lucide-react";

interface POSSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
}

export function POSSidebar({ activeTab, onTabChange, cartItemCount }: POSSidebarProps) {
  const menuItems = [
    { 
      id: 'sales', 
      label: 'Продажи', 
      icon: ShoppingCart, 
      badge: cartItemCount > 0 ? cartItemCount : null,
      description: 'Каталог и касса'
    },
    { 
      id: 'giftbox', 
      label: 'Конструктор коробок', 
      icon: Gift,
      description: 'Подарочные наборы'
    },
    { 
      id: 'customers', 
      label: 'Клиенты', 
      icon: Users,
      description: 'База покупателей'
    },
    { 
      id: 'analytics', 
      label: 'Аналитика', 
      icon: BarChart3,
      description: 'Отчеты и метрики'
    },
    { 
      id: 'products', 
      label: 'Каталог', 
      icon: Package,
      description: 'Управление товарами'
    },
    { 
      id: 'transactions', 
      label: 'Транзакции', 
      icon: Receipt,
      description: 'История продаж'
    },
    { 
      id: 'finance', 
      label: 'Финансы', 
      icon: Wallet,
      description: 'Доходы и расходы'
    },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Настройки', icon: Settings, description: 'Конфигурация' },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded qand-accent-bg flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="qand-brand-text text-lg">QAND</h2>
            <p className="qand-subtitle text-xs -mt-1 text-sidebar-foreground/60">
              POS System
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start p-3 transition-colors ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-qand-accent text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start p-3 transition-colors ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="text-sm">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}