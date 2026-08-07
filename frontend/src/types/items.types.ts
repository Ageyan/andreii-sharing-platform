export interface Item {
    id: number
    title: string
    description: string
    price_per_day: number
    category: string
    image_url: string[]
    owner_name: string 
    owner_created_at: string
    owner_id: number
    owner_avatar?: string
}

export type CreateItem = Omit<Item, 'id' | 'owner_name' | 'owner_created_at' | 'image_url' | 'owner_id' | 'owner_avatar'>;

export type ItemCategory = 'Усі речі' | 'Авто' | 'Електроніка' | 
'Робота' | 'Запчастини' | 'Дім і сад' | 'Бізнес та послуги' | 'Дитячий світ' 
| 'Відпочинок і спорт' | 'Товари для геймерів' | 'Нерухомість';

export type ItemCategoryAdd = Exclude<ItemCategory, 'Усі речі'> | 'Оберіть категорію';

export interface PaginatedItems {
    data: Item[]
    hasMore: boolean
}

