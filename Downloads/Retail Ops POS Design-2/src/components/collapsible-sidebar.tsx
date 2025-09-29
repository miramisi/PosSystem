import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
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
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

interface CollapsibleSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function CollapsibleSidebar({ 
  activeTab, 
  onTabChange, 
  cartItemCount, 
  isCollapsed, 
  onToggleCollapse 
}: CollapsibleSidebarProps) {
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
      label: 'Премиум', 
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
    { id: 'settings', label: 'Настройки', icon: Settings, description: 'Конфигурация системы' },
  ];

  const SidebarButton = ({ item, isBottom = false }: { item: any; isBottom?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    
    const buttonContent = (
      <Button
        variant="ghost"
        className={`${isCollapsed ? 'w-12 h-12 p-0' : 'w-full justify-start p-3'} transition-all duration-200 ${
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' 
            : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
        }`}
        onClick={() => onTabChange(item.id)}
      >
        <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
        {!isCollapsed && (
          <>
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
              <Badge className="ml-auto bg-qand-brown text-white text-xs border-0">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.label}</span>
              {item.badge && (
                <Badge className="bg-qand-brown text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-qand-brown flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="qand-brand-text text-lg text-sidebar-foreground">QAND</h2>
                <p className="qand-subtitle text-xs -mt-1 text-sidebar-foreground/60">
                  POS System
                </p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-qand-brown flex items-center justify-center mx-auto">
              <Crown className="h-5 w-5 text-white" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 p-3">
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <SidebarButton key={item.id} item={item} />
          ))}
        </nav>
      </div>
      
      {/* Bottom Navigation */}
      <div className="p-3 border-t border-sidebar-border">
        <nav className="space-y-1.5">
          {bottomItems.map((item) => (
            <SidebarButton key={item.id} item={item} isBottom />
          ))}
        </nav>
      </div>
    </div>
  );
}