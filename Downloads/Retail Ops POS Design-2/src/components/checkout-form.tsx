import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Receipt, 
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  discountLevel: number;
  avatar?: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  customer?: Customer;
  onConfirm: (paymentData: {
    paymentMethod: 'card' | 'cash' | 'transfer';
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cashReceived?: number;
    transferPhone?: string;
    notes?: string;
    printReceipt: boolean;
  }) => void;
  onCancel: () => void;
}

export function CheckoutForm({ items, customer, onConfirm, onCancel }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [transferPhone, setTransferPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [printReceipt, setPrintReceipt] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Расчеты
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.discount 
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const customerDiscount = customer?.discountLevel || 0;
  const discountAmount = subtotal * (customerDiscount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.2;
  const total = subtotalAfterDiscount + tax;
  
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const change = cashReceivedNum - total;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiry(e.target.value));
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return cardNumber.replace(/\s/g, '').length >= 16 && 
             expiryDate.length === 5 && 
             cvv.length >= 3;
    } else if (paymentMethod === 'cash') {
      return cashReceivedNum >= total;
    } else if (paymentMethod === 'transfer') {
      return transferPhone.length >= 10;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsProcessing(true);
    
    // Имитация обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onConfirm({
      paymentMethod,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'card' ? expiryDate : undefined,
      cvv: paymentMethod === 'card' ? cvv : undefined,
      cashReceived: paymentMethod === 'cash' ? cashReceivedNum : undefined,
      transferPhone: paymentMethod === 'transfer' ? transferPhone : undefined,
      notes: notes || undefined,
      printReceipt
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка - Детали заказа */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Детали заказа
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.quantity} × {item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price}
                      </div>
                    </div>
                    <div className="font-medium">
                      {((item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Подытог:</span>
                    <span>₽{subtotal.toFixed(2)}</span>
                  </div>
                  {customer && customerDiscount > 0 && (
                    <div className="flex justify-between text-sm text-qand-brown">
                      <span>Скидка клиента ({customerDiscount}%):</span>
                      <span>-₽{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>НДС (20%):</span>
                    <span>₽{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>К оплате:</span>
                    <span>₽{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Информация о клиенте */}
            {customer && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Клиент
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                    {customer.discountLevel > 0 && (
                      <Badge variant="secondary" className="bg-qand-brown text-white">
                        {customer.discountLevel}% скидка
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Правая колонка - Способ оплаты */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Способ оплаты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value: 'card' | 'cash' | 'transfer') => setPaymentMethod(value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      Банковская карта
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Banknote className="w-4 h-4" />
                      Наличными
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex items-center gap-2 flex-1 cursor-pointer">
                      <Smartphone className="w-4 h-4" />
                      Перевод по номеру телефона
                    </Label>
                  </div>
                </RadioGroup>

                {/* Поля для карты */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <Label htmlFor="cardNumber">Номер карты</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Срок действия</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          maxLength={5}
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="font-mono"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Поля для наличных */}
                {paymentMethod === 'cash' && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <Label htmlFor="cashReceived">Получено наличными</Label>
                      <Input
                        id="cashReceived"
                        placeholder={`${total.toFixed(2)}`}
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value.replace(/[^\d.]/g, ''))}
                        type="number"
                        step="0.01"
                        min={total}
                      />
                    </div>
                    {cashReceivedNum > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Сдача:</span>
                          <span className={`font-bold ${change >= 0 ? 'text-qand-mint' : 'text-qand-rose'}`}>
                            {change.toFixed(2)}
                          </span>
                        </div>
                        {change < 0 && (
                          <div className="flex items-center gap-1 mt-1 text-qand-rose text-sm">
                            <AlertTriangle className="w-3 h-3" />
                            Недостаточно средств
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Поля для перевода */}
                {paymentMethod === 'transfer' && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <Label htmlFor="transferPhone">Номер телефона плательщика</Label>
                      <Input
                        id="transferPhone"
                        placeholder="+7 (999) 123-45-67"
                        value={transferPhone}
                        onChange={(e) => setTransferPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Дополнительные опции */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Дополнительно</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Комментарий к заказу</Label>
                  <Textarea
                    id="notes"
                    placeholder="Особые пожелания или примечания..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="printReceipt"
                    checked={printReceipt}
                    onChange={(e) => setPrintReceipt(e.target.checked)}
                    className="w-4 h-4 rounded border-2"
                  />
                  <Label htmlFor="printReceipt" className="cursor-pointer">
                    Печатать чек
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid() || isProcessing}
            className="bg-qand-brown hover:bg-qand-brown/90 min-w-32"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Обработка...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Оплатить {total.toFixed(2)}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}