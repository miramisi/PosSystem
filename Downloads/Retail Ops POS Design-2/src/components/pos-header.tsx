import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Bell, User, Settings, Crown } from "lucide-react";

export function POSHeader() {
  return (
    <div className="border-b bg-card px-6 py-4 qand-subtle-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded qand-accent-bg flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="qand-brand-text text-xl">QAND</h1>
              <p className="qand-subtitle text-xs -mt-1">POS System</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="border-green-200 text-green-700 px-2 py-1"
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            Online
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 max-w-md flex-1 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Поиск товаров..." 
              className="pl-10 border-border focus:border-qand-brown"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}