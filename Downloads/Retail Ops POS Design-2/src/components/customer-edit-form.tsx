import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { 
  Save, 
  X, 
  Plus,
  Trash2,
  ArrowLeft,
  Users,
  Instagram,
  Facebook
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
}

interface CustomerEditFormProps {
  customer: CustomerData;
  onSave: (customer: CustomerData) => void;
  onCancel: () => void;
}

export function CustomerEditForm({ customer, onSave, onCancel }: CustomerEditFormProps) {
  const [editedCustomer, setEditedCustomer] = useState<CustomerData>({ ...customer });
  const [newFavoriteType, setNewFavoriteType] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newRelation, setNewRelation] = useState({ name: "", relationship: "", birthday: "" });

  const handleSave = () => {
    if (!editedCustomer.name || !editedCustomer.email) {
      toast.error("Заполните обязательные поля");
      return;
    }
    
    onSave(editedCustomer);
    toast.success("Данные клиента обновлены");
  };

  const addFavoriteType = () => {
    if (newFavoriteType.trim()) {
      setEditedCustomer({
        ...editedCustomer,
        preferences: {
          ...editedCustomer.preferences,
          favoriteTypes: [...editedCustomer.preferences.favoriteTypes, newFavoriteType.trim()]
        }
      });
      setNewFavoriteType("");
    }
  };

  const removeFavoriteType = (index: number) => {
    setEditedCustomer({
      ...editedCustomer,
      preferences: {
        ...editedCustomer.preferences,
        favoriteTypes: editedCustomer.preferences.favoriteTypes.filter((_, i) => i !== index)
      }
    });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setEditedCustomer({
        ...editedCustomer,
        preferences: {
          ...editedCustomer.preferences,
          allergies: [...editedCustomer.preferences.allergies, newAllergy.trim()]
        }
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setEditedCustomer({
      ...editedCustomer,
      preferences: {
        ...editedCustomer.preferences,
        allergies: editedCustomer.preferences.allergies.filter((_, i) => i !== index)
      }
    });
  };

  const addRelation = () => {
    if (newRelation.name.trim() && newRelation.relationship.trim()) {
      setEditedCustomer({
        ...editedCustomer,
        relations: [
          ...editedCustomer.relations,
          {
            id: `rel_${Date.now()}`,
            name: newRelation.name.trim(),
            relationship: newRelation.relationship.trim(),
            birthday: newRelation.birthday || undefined
          }
        ]
      });
      setNewRelation({ name: "", relationship: "", birthday: "" });
    }
  };

  const removeRelation = (id: string) => {
    setEditedCustomer({
      ...editedCustomer,
      relations: editedCustomer.relations.filter(rel => rel.id !== id)
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Отменить
        </Button>
        <h1 className="flex-1">Редактирование клиента</h1>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Сохранить
        </Button>
      </div>

      {/* Основная форма */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка - Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Фото и имя */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarImage src={editedCustomer.avatar} alt={editedCustomer.name} />
                <AvatarFallback className="text-lg">
                  {editedCustomer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={editedCustomer.name}
                    onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Контакты */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedCustomer.email}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={editedCustomer.phone}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="birthday">Дата рождения</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={editedCustomer.birthday}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, birthday: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customerGroup">Группа</Label>
                <select
                  id="customerGroup"
                  value={editedCustomer.customerGroup || 'B2C'}
                  onChange={(e) => setEditedCustomer({ 
                    ...editedCustomer, 
                    customerGroup: e.target.value as 'B2B' | 'B2B2C' | 'B2C' | 'B2G' | 'Other'
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="B2B">B2B - Бизнес-клиент</option>
                  <option value="B2B2C">B2B2C - Партнер-посредник</option>
                  <option value="B2C">B2C - Частный клиент</option>
                  <option value="B2G">B2G - Государственный клиент</option>
                  <option value="Other">Other - Прочее</option>
                </select>
              </div>
            </div>

            {/* Финансовые данные */}
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountLevel">Уровень скидки (%)</Label>
                <Input
                  id="discountLevel"
                  type="number"
                  min="0"
                  max="100"
                  value={editedCustomer.discountLevel}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, discountLevel: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="balance">Баланс</Label>
                <Input
                  id="balance"
                  type="number"
                  value={editedCustomer.balance}
                  onChange={(e) => setEditedCustomer({ ...editedCustomer, balance: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Социальные сети */}
            <Separator />
            <div className="space-y-3">
              <Label>Социальные сети</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-qand-rose" />
                  <Input
                    placeholder="@username"
                    value={editedCustomer.socialMedia.instagram || ""}
                    onChange={(e) => setEditedCustomer({
                      ...editedCustomer,
                      socialMedia: { ...editedCustomer.socialMedia, instagram: e.target.value }
                    })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-qand-sky" />
                  <Input
                    placeholder="facebook.username"
                    value={editedCustomer.socialMedia.facebook || ""}
                    onChange={(e) => setEditedCustomer({
                      ...editedCustomer,
                      socialMedia: { ...editedCustomer.socialMedia, facebook: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Правая колонка - Предпочтения и связи */}
        <Card>
          <CardHeader>
            <CardTitle>Предпочтения и связи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Любимый напиток */}
            <div>
              <Label htmlFor="favoriteDrink">Любимый напиток</Label>
              <Input
                id="favoriteDrink"
                value={editedCustomer.preferences.favoriteDrink}
                onChange={(e) => setEditedCustomer({
                  ...editedCustomer,
                  preferences: { ...editedCustomer.preferences, favoriteDrink: e.target.value }
                })}
                placeholder="Капучино, Эспрессо, Чай..."
              />
            </div>

            {/* Любимые типы шоколада */}
            <div>
              <Label>Любимые типы шоколада</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {editedCustomer.preferences.favoriteTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {type}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeFavoriteType(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить тип шоколада..."
                    value={newFavoriteType}
                    onChange={(e) => setNewFavoriteType(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFavoriteType()}
                  />
                  <Button size="sm" onClick={addFavoriteType}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Аллергии */}
            <div>
              <Label>Аллергии</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {editedCustomer.preferences.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="gap-1">
                      ⚠️ {allergy}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-white hover:text-destructive"
                        onClick={() => removeAllergy(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить аллергию..."
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button size="sm" onClick={addAllergy}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Родственные связи */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" />
                <Label>Семья</Label>
              </div>
              <div className="space-y-3">
                {editedCustomer.relations.map((relation) => (
                  <div key={relation.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={relation.avatar} alt={relation.name} />
                      <AvatarFallback className="text-xs">
                        {relation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{relation.name}</div>
                      <div className="text-xs text-muted-foreground">{relation.relationship}</div>
                      {relation.birthday && (
                        <div className="text-xs text-muted-foreground">
                          🎂 {new Date(relation.birthday).toLocaleDateString('ru-RU')}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeRelation(relation.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {/* Добавление новой связи */}
                <div className="grid grid-cols-1 gap-2">
                  <Input
                    placeholder="Имя"
                    value={newRelation.name}
                    onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                  />
                  <Input
                    placeholder="Связь (супруг, дочь, сын...)"
                    value={newRelation.relationship}
                    onChange={(e) => setNewRelation({ ...newRelation, relationship: e.target.value })}
                  />
                  <div>
                    <Label htmlFor="relationBirthday" className="text-xs">Дата рождения</Label>
                    <Input
                      id="relationBirthday"
                      type="date"
                      placeholder="Дата рождения"
                      value={newRelation.birthday}
                      onChange={(e) => setNewRelation({ ...newRelation, birthday: e.target.value })}
                    />
                  </div>
                </div>
                <Button size="sm" onClick={addRelation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить члена семьи
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}