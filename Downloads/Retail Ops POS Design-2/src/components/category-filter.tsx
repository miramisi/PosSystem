import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-3">Категории конфет</h3>
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={`whitespace-nowrap ${activeCategory === 'all' ? 'bg-qand-brown hover:bg-qand-brown/90' : ''}`}
          >
            Все товары
            <Badge variant="secondary" className="ml-2">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </Badge>
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`whitespace-nowrap ${activeCategory === category.id ? 'bg-qand-brown hover:bg-qand-brown/90' : ''}`}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}