import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package } from "lucide-react";

export function AnalyticsDashboard() {
  const stats = [
    {
      title: "Продажи сегодня",
      value: "18,420",
      change: "+15.8%",
      trend: "up",
      icon: DollarSign,
      color: "qand-mint"
    },
    {
      title: "Конфеты проданы",
      value: "287",
      change: "+22.1%",
      trend: "up",
      icon: ShoppingBag,
      color: "qand-sky"
    },
    {
      title: "Подарочных коробок",
      value: "34",
      change: "+18.5%",
      trend: "up",
      icon: Package,
      color: "qand-purple"
    },
    {
      title: "Постоянных клиентов",
      value: "156",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      color: "qand-rose"
    }
  ];

  const topProducts = [
    { name: "Трюфель с коньяком", sales: 89, revenue: "7,565" },
    { name: "Пралине с фундуком", sales: 67, revenue: "5,025" },
    { name: "Подарочная коробка 12 конфет", sales: 34, revenue: "13,600" },
    { name: "Темный шоколад 85%", sales: 45, revenue: "2,925" },
    { name: "Карамель с морской солью", sales: 52, revenue: "3,640" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">🍫 Аналитика шоколадного бутика</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                      {stat.change}
                    </span>
                    <span className="ml-1">за последние 24ч</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Популярные конфеты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} продаж</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Продажи по часам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "09:00 - 12:00", amount: "3,240", percentage: 65 },
                { time: "12:00 - 15:00", amount: "6,780", percentage: 85 },
                { time: "15:00 - 18:00", amount: "5,920", percentage: 95 },
                { time: "18:00 - 21:00", amount: "2,480", percentage: 45 }
              ].map((period) => (
                <div key={period.time} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{period.time}</span>
                    <span className="font-medium">{period.amount}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${period.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}